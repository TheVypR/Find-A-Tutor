#FIND-A-TUTOR ~ Login Backend + All routes + conversion functions ~ Author: Isaac A., Aaron S., Tim W., Nathan B.
import hashlib                                              #used to hash pw to check against pw in DB
import random                                               #used for random string generation
from flask import Flask, request, jsonify, send_file        #used for Flask API
import profile, signup, appointment, history, adminRoutes, authentication, timeManager   #used to call functions
from flaskext.mysql import MySQL                            #used to connect to DB
from flask_cors import CORS                                 #used to ignore CORS
from io import BytesIO                                      #used for file upload
import os

#setup flask
app = Flask(__name__)
CORS(app)

#setup DB
mysql = MySQL()

#directory paths
office_hours_dir = './office_hours/'
syllabi_dir = './syllabi/'

#toggle for accessing the DB on a local machine
locality = 1 # have locality set to 1 if you want to test on your local machine
if (locality == 1):
    app.config['MYSQL_DATABASE_HOST'] = '10.18.110.181'
    app.config['MYSQL_DATABASE_USER'] = 'test'
    app.config['MYSQL_DATABASE_PASSWORD'] = 'C0dePr0j$'
    app.config['MYSQL_DATABASE_DB'] = 'findatutor'
else:
    app.config['MYSQL_DATABASE_HOST'] = 'localhost'
    app.config['MYSQL_DATABASE_USER'] = 'trwarner00'
    app.config['MYSQL_DATABASE_PASSWORD'] = 'Timothy21!'
    app.config['MYSQL_DATABASE_DB'] = 'findatutor'

mysql.init_app(app)

#checks provided email and password for existence in the DB
@app.route('/login/', methods=['POST'])
def login():
  #connect to DB
  conn = mysql.connect()
  conn.autocommit(True)
  cursor = conn.cursor()
  
  #get the login provided
  info = request.get_json()
  email = info[0]
  pw = info[1]

  #get the salt used for pw associated with this email
  cursor.execute("select stu_salt from Student where stu_email = \""
                          + email + "\"")               
  result = cursor.fetchone()

  #check that email existed in users (Student table)
  if result is None:
    return 'Invalid Email', 401
  
  #on user existing
  #hash their login attempt password
  #check hash against stored password to verify identity
  if(result):
      #use salt to hash given password
      salt = bytes.fromhex(result[0])
      password = hashlib.pbkdf2_hmac(
          'sha256', # The hash digest algorithm for HMAC
          pw.encode('utf-8'), # Convert the password to bytes
          salt, # Provide the salt
          100000 #100,000 iterations of SHA-256
      )
      
      #combine password and salt
      password = salt + password
      #check for password in DB
      cursor.execute("select stu_email, token, isAdmin from Student where stu_email = \""
                              + email + "\" and stu_pass = \""
                              + password.hex() + "\"")
      user = cursor.fetchone()
      
      #if password not found -> ERROR
      if user is None:
        return 'Incorrect Password', 401
    
  #if user is a tutor, check login preference
  cursor.execute("select login_pref from Tutor where tut_email = \"" + email + "\"")
  checkIfTutor = cursor.fetchone()
  
  #if the user is found in Tutor table
  #send their login pref to frontend
  #else login pref is student
  if checkIfTutor:
      loginPref = checkIfTutor[0]
      isTutor = True
  else:
      loginPref = 0
      isTutor = False

  #close connection
  conn.close()

  #return email, permissions, and login preference
  return jsonify({'email': user[0], 'token':user[1],'isAdmin': user[2], 'isTutor': isTutor, 'loginPref':loginPref}), 200

@app.route('/removeTutor/', methods=['POST'])
def removeTutor():
    tutor = request.get_json()
    tutor = authentication.getEmail(tutor)
    return profile.remove_tutor(tutor)

@app.route('/authCheck/', methods=['GET'])
def checkLogIn():
    token = request.args.get("token")
    return authentication.checkLogIn(token)
    
#retrieve all the appointments for a student or tutor
@app.route('/getAppointments/', methods=['GET'])
def getAppointments():
    token = request.args.get("token")   #token to get appointments for
    tutView = request.args.get("view")  #whether to retrieve tutor appointments or student
    return appointment.getAppointments(token, tutView=="tutor")
    
@app.route('/getGroupTutoring/', methods=['GET'])
def getGroupTutoring():
    token = request.args.get("token")
    email = authentication.getEmail(token)[0]
    return appointment.getGroupTutoring(email)
    
#return a list of all current tutors
@app.route('/CurrentTutors/', methods=['GET'])
def currentTutors():
    return adminRoutes.CurrentTutors()

#add a student's information to the Tutor table 
@app.route('/AddTutor/', methods=['POST'])
def addTutor():
    token = request.get_json()
    email = authentication.getEmail(token)[0]
    return adminRoutes.BecomeATutor(email)

#retrieve a dictionary of all relevant tutors who are available on call
#only shows tutors who teach a class that the student (token) is taking
@app.route('/Contactable/', methods=['GET'])
def contactable():
    token = request.args.get("token")       #get token of student to compare classes
    return adminRoutes.Contactable(token)

#list of all outstanding reports on tutors
@app.route('/ReportedTutors/', methods=['GET'])
def reportedTutors():
    return adminRoutes.ReportedTutors()

#list of all outstanding reports on students
@app.route('/ReportedStudents/', methods=['GET'])
def reportedStudents():
    return adminRoutes.ReportedStudents()

#list of all students who have been banned
@app.route('/BannedStudents/', methods=['GET'])
def bannedStudents():
    return adminRoutes.BannedStudents()

# remove report from reported students or reported tutors list
@app.route('/DimissReport/', methods=['POST'])
def dismissReport():
    target = request.get_json()             #get report to dismiss
    adminRoutes.DeleteUserFromList(target)
    return 'Done', 200

#list of all group tutoring sessions
@app.route('/GroupTutoring/', methods=['GET'])
def groupTutoring():
    return adminRoutes.GroupTutoringList()

#post call on editing form data
@app.route('/EditTutoring/', methods=['POST'])
def editTutoring():
    groupSession = request.get_json()
    return adminRoutes.EditTutoring(groupSession)

@app.route('/DeleteGroup/', methods=['POST'])
def deleteGroup():
    groupSession = request.get_json()
    return adminRoutes.DeleteGroup(groupSession)

#ban a student or tutor
#removes user from all Tutor and Student tables
#replaces user in Appointments with the "banned" id
@app.route('/AddStudentToBan/', methods=['POST'])
def addStudentToBan():
    target = request.get_json()          #get target info
    adminRoutes.AddStudentToBan(target)
    return 'Done', 200

#submit data to sign up for site
@app.route('/signup/', methods=['POST'])
def signUp():
  data = request.get_json() #get signup data
  return signup.signup(data)#return success or fail

#submit changed profile information to the DB
@app.route('/myProfile/', methods=['POST'])
def myProfile():
    #get information to change
    submission = request.get_json()
    token = submission['token']
    email = authentication.getEmail(token)[0]
    #Check to see if this is a removal
    if 'remove' in submission.keys():
        #remove timeslot from TutorTimes
        submittedTime = submission['remove']
        startTime = timeManager.dateParse(submittedTime['startTime'])
        endTime = timeManager.dateParse(submittedTime['endTime'])
        timeSlot = {'start': startTime, 'end': endTime}
        splitTimeVals = timeManager.splitTimes(timeSlot)
        return profile.remove_timeSlot(splitTimeVals, email)
    #check to see if it is a change in the contact me checkbox
    elif 'contactMe' in submission.keys():
        return profile.contactMe_change(submission['contactMe'], email)
    #check to see if it's an addition to available times
    elif 'submitTimes' in submission.keys() :
        #parse timeslot and divide it into 15 min chunks for storage
        startTime = timeManager.dateParse(submission['startTime'])
        endTime = timeManager.dateParse(submission['endTime'])
        timeSlot = {'start': startTime, 'end': endTime}
        times = timeManager.splitTimes(timeSlot)
        return profile.post_timeSlot(times, email)
    elif 'classesTaking' in submission.keys():
        return profile.edit_student_classes(submission, email)
    #otherwise the user hit the apply button for other changes
    else:
        return profile.edit_profile(submission, email)

#retrieve the weekday from an ISO date
### TODO: Currently not used but needed for future ###
def getDayFromISO(day):
    weekday = ""

    if day==1:
        weekday="Monday"
    elif day==2:
        weekday="Tuesday"
    elif day==3:
        weekday="Wednesday"
    elif day==4:
        weekday="Thursday"
    elif day==5:
        weekday="Friday"
    elif day==6:
        weekday="Saturay"
    else:
        weekday="Sunday"

    return weekday

#retrieve the profile information for a user
@app.route('/myProfile/', methods=['GET'])
def getProfile():
    #get user email
    token = request.args.get('token')
    
    #determine what profile is being populated
    isTutor = request.args.get('view')
    return profile.retrieve_profile(token)


# @app.route('/allClasses/', method=['POST'])
# def allClasses():
#     return profile.retrieve_allClasses

#add appointments to DB
@app.route('/addAppointment/', methods=['POST'])
def addAppointment():
  data = request.get_json()[0]
  token = data['token']
  
  #combine times and a day to make a datetime
  newStart = timeManager.createDateFromTime(data['day'], data['start'])
  newEnd = timeManager.createDateFromTime(data['day'], data['end'])
  
  #split the datetimes into 15 minute intervals for storage
  slots = timeManager.splitTimes({'start':newStart, 'end':newEnd})
  #add the appointment and mark tutor time as taken
  return appointment.addAppointment(data, token, newStart, newEnd, slots)

#get the rates for all classes for a specific tutor
@app.route('/getRates/', methods=['POST'])
def getRates():
    data = request.get_json()           #get tutor token
    return appointment.getRates(data)

#get all classes a student is taking
@app.route('/getStuClasses/', methods=['GET'])
def getStuClasses():
    token = request.args.get("token")
    return appointment.getStuClasses(token)

#get all times from relevant tutors
#only retrieves from tutors that teach classes the student is taking
@app.route('/getTimes/', methods=['GET'])
def getTimes():
    #get student email to compare tutor classes to
    token = request.args.get("token")
    email = authentication.getEmail(token)[0]
    unmerged = appointment.getTimes(email)
    #if there are times returned
    if len(unmerged) != 0:
        #merge 15 minute intervals into time blocks for displaying
        if type(unmerged) == type([]):
            times = timeManager.mergeTimes(unmerged)
        else:
            return "No times found", 401
    else:
        #return empty times array
        []
        
    return {'times':times}

#remove an appointment from a students calendar
@app.route('/deleteAppointment/', methods=['POST'])
def deleteAppointment():
    data = request.get_json()   #get data from frontend
    token = data['token']       #get the token from data
    view = data['view']         #get the view
    
    email = authentication.getEmail(token)[0]
    
    #parse moments into datetimes for storage
    newDate = {'start': data['start'], 'end': data['end']}
    
    #split the datetimes into 15 minute intervals
    slots = timeManager.splitTimes({'start':data['start'], 'end':data['end']})
  
    return appointment.removeAppointment(email, data, newDate, slots, view)

#load past appointments for a student or tutor
@app.route('/loadAppointment/', methods=['GET'])
def loadAppointments():
    token=request.args.get("token")
    isTutor=request.args.get("view")
    
    #if user is on tutor view
    if isTutor == "tutor":
        #load previous appointments with user's students
        return history.loadPreviousAppointmentsTutor(token)
    else:
        #load previous appointments with user's tutors
        return history.loadPreviousAppointmentsStudent(token)

#submit a rating for a student or tutor
@app.route('/submitRating/', methods=['POST'])
def rateTutor():
    data = request.get_json()
    return history.submitRating(data)

#report a student or tutor for an issue on a past appointment
@app.route('/submitReport/', methods=['POST'])
def report():
    data = request.get_json()
    token=data["token"]
    email = authentication.getEmail(token)
    isTutor = data["view"]
    #if reporter is a tutor
    if isTutor == "tutor":
        #report a student
        return history.submitStudentReport(data, email)
    else:
        #report a tutor
        return history.submitTutorReport(data, email)

#called when tutor presses button to request to be verified for a class
@app.route('/requestVerification/', methods=['POST'])
def verifyRequest():
    data = request.get_json()           #get the data
    token = data["token"]               #get the token from the data
    class_code = data["class_code"]     #get the class code from the data
    email = authentication.getEmail(token)[0]#use token to get email
    
    #return the success or failure
    return adminRoutes.submitVerifyRequest(email, class_code)

@app.route('/fileUpload/', methods=['POST'])
def fileUpload():
    d = {}
    try:
        file = request.files['file']
        filename = file.filename
        file_bytes = file.read()
        file_content = file_bytes.decode('utf-8')
        d['status'] = 1
    except Exception as e:
        d['status'] = 0

    return jsonify(d), 200

@app.route('/professorCSV/', methods=['POST'])
def professorUpload():    
    #get the data from the given file
    try:
        file = request.files['file']
        filename = file.filename
        file_bytes = file.read()
        file_content = file_bytes.decode("utf-8") #str(BytesIO(file_bytes).readlines())
    except:
        return "ERROR: Problem Reading File", 400
    
    #send to the database
    return adminRoutes.professorUploading(parseCSVData(file_content))

@app.route('/classUpload/', methods=['POST'])
def classUpload():    
    #get the data from the given file
    try:
        file = request.files['file']
        filename = file.filename
        file_bytes = file.read()
        file_content = file_bytes.decode("utf-8")
    except:
        return "ERROR: Problem Reading File", 400
    
    #send to the database
    return adminRoutes.classUploading(parseCSVData(file_content))

@app.route('/officeHoursUpload/', methods=['POST'])
def saveOfficeHours():
    d = {}
    try:
        file = request.files['file']
        file.save(os.path.join(office_hours_dir, file.filename))
        adminRoutes.saveOfficeHours(file.filename)
        d['status'] = 1
    except Exception as e:
        d['status'] = 0

    return jsonify(d), 200

@app.route('/downloadOfficeHours/', methods=['GET'])
def loadSyllabus():
    file = request.args.get("filename")
    return send_file(os.path.join(office_hours_dir, file), attachment_filename=file)

@app.route('/syllabiUpload/', methods=['POST'])
def saveSyllabi():
    d = {}
    try:
        file = request.files['file']
        file.save(os.path.join(syllabi_dir, file.filename))
        adminRoutes.saveOfficeHours(file.filename)
        d['status'] = 1
    except Exception as e:
        d['status'] = 0

    return jsonify(d), 200

@app.route('/downloadSyllabus/', methods=['GET'])
def loadSyllabus():
    file = request.args.get("filename")
    return send_file(os.path.join(syllabi_dir, file), attachment_filename=file)

@app.route('/getProfessors/', methods=['GET'])
def getProfessors():
    return adminRoutes.getProfessors()

@app.route('/isTutor/', methods=['GET'])
def isTutor():
    token=request.args.get("token")
    email = authentication.getEmail(token)[0]
    return profile.isTutor(email)
    
#parse the data from a CSV file
def parseCSVData(data):
    parsedData = []
    rowAry = []
    rows = data.split('\n')
    first = True#used to ignore the first row (header)
    #go through all the rows (except the first) in the csv file
    for row in rows:
        if first:
            first = False
            continue
        columns = row.split(",")
        parsedData.append(columns)
    return parsedData