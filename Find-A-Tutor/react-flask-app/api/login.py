#FIND-A-TUTOR ~ Login Backend + All routes + conversion functions ~ Author: Isaac A., Aaron S., Tim W., Nathan B.
import hashlib                                              #used to hash pw to check against pw in DB
import random                                               #used for random string generation
from datetime import datetime, timedelta                    #used to compare dates
from flask import Flask, request, jsonify                   #used for Flask API
import profile, signup, appointment, history, adminRoutes, authentication   #used to call functions
from flaskext.mysql import MySQL                            #used to connect to DB
from flask_cors import CORS

#setup flask
app = Flask(__name__)
CORS(app)

#setup DB
mysql = MySQL()

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
        startTime = dateParse(submittedTime['startTime'])
        endTime = dateParse(submittedTime['endTime'])
        timeSlot = {'start': startTime, 'end': endTime}
        splitTimeVals = splitTimes(timeSlot)
        return profile.remove_timeSlot(splitTimeVals, email)
    #check to see if it is a change in the contact me checkbox
    elif 'contactMe' in submission.keys():
        return profile.contactMe_change(submission['contactMe'], email)
    #check to see if it's an addition to available times
    elif 'submitTimes' in submission.keys() :
        #parse timeslot and divide it into 15 min chunks for storage
        startTime = dateParse(submission['startTime'])
        endTime = dateParse(submission['endTime'])
        timeSlot = {'start': startTime, 'end': endTime}
        times = splitTimes(timeSlot)
        return profile.post_timeSlot(times, email)
    #check is this is removing a time populated by the db
    elif 'removePrefilledTime' in submission.keys():
        return profile.remove_timeSlot(submission['removePrefilledTime'], email)
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

#add appointments to DB
@app.route('/addAppointment/', methods=['POST'])
def addAppointment():
  data = request.get_json()[0]
  token = data['token']
  
  #combine times and a day to make a datetime
  newStart = createDateFromTime(data['day'], data['start'])
  newEnd = createDateFromTime(data['day'], data['end'])
  
  #split the datetimes into 15 minute intervals for storage
  slots = splitTimes({'start':newStart, 'end':newEnd})
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
    
    #if there are times returned
    if len(appointment.getTimes(token)) != 0:
        #merge 15 minute intervals into time blocks for displaying
        unmerged = appointment.getTimes(token)[0]
        if type(unmerged) == type([]):
            times = mergeTimes(unmerged)
        else:
            return "No times found", 401
    else:
        #return empty times array
        times = []
    return {'times':times}, 200



#remove an appointment from a students calendar
@app.route('/deleteAppointment/', methods=['POST'])
def deleteAppointment():
    data = request.get_json()   #get data from frontend
    token = data['token']       #get the token from data
    view = data['view']         #get the view
    
    #parse moments into datetimes for storage
    newDate = {'start': data['start'], 'end': data['end']}
    
    #split the datetimes into 15 minute intervals
    slots = splitTimes({'start':data['start'], 'end':data['end']})
  
    return appointment.removeAppointment(token, data, newDate, slots, view)

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

#take a Moment format from React and format it to YYYY-MM-DDThh:mm:ss
#needed for storage and calendar display
def dateParse(date):
    #get the parts of the date
    #separated by whitespace
    dateArray = date.split()
    
    #put the year into the new datetime
    newDate = dateArray[3] + "-"
    
    #put the month into the new datetime
    if(dateArray[1] == "Jan"):
        newDate += "01-"
    elif(dateArray[1] == "Feb"):
        newDate += "02-"
    elif(dateArray[1] == "Mar"):
        newDate += "03-"
    elif(dateArray[1] == "Apr"):
        newDate += "04-"
    elif(dateArray[1] == "May"):
        newDate += "05-"
    elif(dateArray[1] == "Jun"):
        newDate += "06-"
    elif(dateArray[1] == "Jul"):
        newDate += "07-"
    elif(dateArray[1] == "Aug"):
        newDate += "08-"
    elif(dateArray[1] == "Sep"):
        newDate += "09-"
    elif(dateArray[1] == "Oct"):
        newDate += "10-"
    elif(dateArray[1] == "Nov"):
        newDate += "11-"
    elif(dateArray[1] == "Dec"):
        newDate += "12-"
    
    #put the day into the new datetime
    newDate += dateArray[2] + "T"
    
    #if seconds is not 00 reset to 00
    checkSec = dateArray[4].split(':')
    if checkSec[2] != "00":
        newDate += checkSec[0] + ":" + checkSec[1] + ":00" 
    else:
        #put the time into the new datetime
        newDate += dateArray[4]
    
    #return the new datetime    
    return newDate

#take a datetime (YYYY-MM-DDThh:mm:ss) and a time (HH:MM)
#combine them into a new datetime (YYYY-MM-DDThh:mm:ss)
#needed for storage recieved from timepickers
def createDateFromTime(day, time):
    #check for proper format
    if len(day) == 19 and 'T' in day:
        #leave day as is
        date = day
    else:
        #parse day to proper format
        date = dateParse(day)
        
    #split on "T" and store the first part (YYYY-MM-DD) in new datetime
    newDay = date.split("T")[0]
    #add the separator, time, and seconds
    newDate = newDay + "T" + time + ":00"

    #return new datetime
    return newDate
    
#takes all the 15min times and makes them one block
#input must be an array of datetimes formatted like this
##### YYYY-MM-DDThh:mm:ss #####
def mergeTimes(timeArray):
    #make sure to exclude the first and include the last block
    first = True
    left = len(timeArray)
    #set the expected difference between timeblocks
    minDif = timedelta(minutes=15)
    
    #management vars
    curTime = datetime.now()        #the last time (for comparing)
    timeBlockArray = []             #the new array of merged timeblocks
    curBlockStart = datetime.now()  #the current start time for a merged block
    curBlockEnd = datetime.now()    #the current end time for a merged block
    lastTutorInfo = timeArray[0]    #the information for the first tutor block (needed to make sure the last block for a user doesn't take the next user's info)

    #go through every in the timeArray
    for time in timeArray:
        #get the start and end times for the entry
        startTime = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
        endTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        
        #check if this is for an appointment or not
        if 'tut_email' in time:
            #if the difference between the last entry and this one is not 15 minutes, start the new merged block
            if ((endTime - curTime) != minDif) or lastTutorInfo['tut_email'] != time['tut_email']:
                #if this is the first don't add last entry's info
                if not first:
                    timeBlockArray.append({
                        'tut_email':lastTutorInfo['tut_email'], 
                        'tut_name':lastTutorInfo['tut_name'],
                        'classes':lastTutorInfo['classes'],
                        'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                        'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                        'type': "time",
                        'title': "Available Time with " + lastTutorInfo['tut_name'],
                        'rating': lastTutorInfo['rating']
                    })
                else:
                    #no longer the first ever entry
                    first = False
                
                #set new blocks start and end
                curBlockStart = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            else:
                #make the new block end equal to the last entry's end time
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
                
            #if this is the last block, finalize the block
            if left == 1:
                timeBlockArray.append({
                    'tut_email':lastTutorInfo['tut_email'], 
                    'tut_name':lastTutorInfo['tut_name'],
                    'classes':lastTutorInfo['classes'],
                    'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                    'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                    'type': "time",
                    'title': "Available Time with " + lastTutorInfo['tut_name'],
                    'rating': time['rating']
                })
        else:
            #if the difference between the last entry and this one is not 15 minutes, create a new merged block
            if (endTime - curTime) != minDif:
            #if this is the first don't add last entry
                if not first:
                    #add the information to the array
                    timeBlockArray.append({
                        'startTime': datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                        'endTime': datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S')
                    })
                else:
                    #no longer the first entry
                    first = False
                
                #start the new block's info
                curBlockStart = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            else:
                #make the new block end equal to the last entry's end time
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            
            #if this is the last block, finalize the block
            if left == 1:
                timeBlockArray.append({
                    'startTime': datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                    'endTime': datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S')
                })
        
        #hold the new last time's end (curTime)
        curTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        left-=1                 #decrement the counter
        lastTutorInfo = time    #hold the info from the last tutor
    
    #return the new array of merged times
    return timeBlockArray
        
#split a large block of time into 15 minute increments
def splitTimes(timeToSplit):
    startSplit = datetime.strptime(timeToSplit['start'], '%Y-%m-%dT%H:%M:%S')   #the start of the block to split
    endSplit = datetime.strptime(timeToSplit['end'], '%Y-%m-%dT%H:%M:%S')       #the end of the block to split
    curEnd = startSplit + timedelta(minutes=15)                                 #the end of the first 15 minute intervals
    splitTimeArray = []                                                         #the array of 15 minute time blocks

    #go through the time block until the end in found
    while curEnd < endSplit:
        #add shortened block into the array
        splitTimeArray.append({
            'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
            'end':datetime.strftime(curEnd, '%Y-%m-%dT%H:%M:%S')
        })
        #get the end and start for the next 15 minute block
        startSplit = curEnd
        curEnd = startSplit + timedelta(minutes=15)
    
    #put last time in array
    splitTimeArray.append({
        'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
        'end':datetime.strftime(endSplit, '%Y-%m-%dT%H:%M:%S')
    })
    
    #return array of 15 minute increments
    return splitTimeArray