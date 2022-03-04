import hashlib
from datetime import datetime, timedelta
from typing import Tuple 
from flask import Flask, request, jsonify
from flask_wtf import FlaskForm
from flask_wtf import Form 
from wtforms import BooleanField
import profile, signup, appointment, history, adminRoutes


#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()
email = "apelia18@gcc.edu"
isTutor = False

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

@app.route('/login/', methods=['POST'])
def login():
  #sql setup
  conn = mysql.connect()
  conn.autocommit(True)
  cursor = conn.cursor()
  #get the login provided
  info = request.get_json()
  global email
  email = info[0]
  pw = info[1]
  print(email)
  print(pw)

  #get the salt
  cursor.execute("select stu_salt from Student where stu_email = \""
                          + email + "\"")               
  result = cursor.fetchone()

  if result is None:
    return jsonify({'error': 'Not Authenticated'})

  if(result):
      salt = bytes.fromhex(result[0])
      password = hashlib.pbkdf2_hmac(
          'sha256', # The hash digest algorithm for HMAC
          pw.encode('utf-8'), # Convert the password to bytes
          salt, # Provide the salt
          100000 #100,000 iterations of SHA-256 
      )
      password = salt + password
      cursor.execute("select stu_email from Student where stu_email = \""
                              + email + "\" and stu_pass = \""
                              + password.hex() + "\"")
      user = cursor.fetchone()
      conn.close()
      print(user)
      if user is None:
        return jsonify({'error': 'Not Authenticated'})

  return jsonify({'email': email})

# provide a list of current tutors
@app.route('/CurrentTutors/', methods=['GET'])
def currentTutors():
    return adminRoutes.CurrentTutors()

# reported tutors list
@app.route('/ReportedTutors/', methods=['GET'])
def reportedTutors():
    return adminRoutes.ReportedTutors()

# reported students list
@app.route('/ReportedStudents/', methods=['GET'])
def reportedStudents():
    return adminRoutes.ReportedStudents()

# provide a list of banned students
@app.route('/BannedStudents/', methods=['GET'])
def bannedStudents():
    return adminRoutes.BannedStudents()

# remove student from reported students or tutors list
@app.route('/DimissReport/', methods=['POST'])
def dismissReport():
    tutor = request.get_json()
    adminRoutes.DeleteUserFromList(tutor)
    return 'Done'

# add student to the banned list
@app.route('/AddStudentToBan/', methods=['POST'])
def addStudentToBan():
    tutor = request.get_json()
    adminRoutes.AddStudentToBan(tutor)
    return 'Done'

#signUp page
@app.route('/signup/', methods=['POST'])
def signUp():
  return signup.signup()

#profile page
@app.route('/myProfile/', methods=['GET', 'POST'])
def myProfile():
  return profile.retrieve_profile("apelia18@gcc.edu")

#add appointments to DB
@app.route('/addAppointment/', methods=['POST'])
def addAppointment():
  data = request.get_json()[0]
  print(data['day'])
  newStart = createDateFromTime(data['day'], data['start'])
  newEnd = createDateFromTime(data['day'], data['end'])
  slots = splitTimes({'start':newStart, 'end':newEnd})
  
  #add the appointment and mark time as taken
  return appointment.addAppointment(data, email, newStart, newEnd, slots)
  
@app.route('/getTimes/', methods=['GET'])
def getTimes():
    times = mergeTimes(appointment.getTimes(email)['times'])
    print(times)
    print(email)
    return {'times':times}
    
@app.route('/getAppointments/', methods=['GET'])
def getAppointments():
    appts = appointment.getAppointments(email)
    return appts
    
@app.route('/deleteAppointment/', methods=['POST'])
def deleteAppointment():
    data = request.get_json()[0]
    newDate = {'start': dateParse(data['start']), 'end': dateParse(data['end'])}
    slots = splitTimes({'start':newDate['start'], 'end':newDate['end']})
    return appointment.removeAppointment(email, data, newDate, slots)

@app.route('/editAppointment/', methods=['POST'])
def editAppointment():
    print("Edit")
    data = request.get_json()[0]
    newDate = {'start': dateParse(data['start']), 'end': dateParse(data['end'])}
    returnSlots = splitTimes({'start':newDate['start'], 'end':newDate['end']})
    takeSlots = splitTimes({'start':newDate['start'], 'end':newDate['end']})
    return appointment.editAppointment(email, data, newDate, returnSlots, takeSlots)

@app.route('/toggleView/')
def toggleView():
    global isTutor
    isTutor = not isTutor
    print(isTutor)
    return str(isTutor)

@app.route('/loadAppointment/', methods=['GET'])
def loadAppointments():
    print(email)
    if isTutor:
        return history.loadPreviousAppointmentsTutor(email)
    else:
        return history.loadPreviousAppointmentsStudent(email)

@app.route('/submitRating/', methods=['POST'])
def rateTutor():
    data = request.get_json()
    return history.submitRating(data[0])

@app.route('/submitReport/', methods=['POST'])
def report():
    data = request.get_json()
    if isTutor:
        return history.submitStudentReport(data[0], email)
    else:
        return history.submitTutorReport(data[0], email)

def dateParse(date):
    #get the parts of the date
    dateArray = date.split()
    
    #get the year
    newDate = dateArray[3] + "-"
    #get the month
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
    #get the day
    newDate += dateArray[2] + "T"
    #get the time
    newDate += dateArray[4]
    
    print(newDate)
    
    return newDate
    
def createDateFromTime(day, time):
    #split up the day
    if len(day) == 19 and 'T' in day:
        date = day
    else:
        date = dateParse(day)
    newDay = date.split("T")[0]
    
    #add the time
    newDate = newDay + "T" + time + ":00"
    
    print(newDate + " 179")
    
    return newDate
    
#takes all the 15min times and makes them one block
#input must be an array of datetimes formatted like this
##### YYYY-MM-DDTHH:mm:SS #####
def mergeTimes(timeArray):
    #make sure to exclude the first and include the last block
    first = True
    left = len(timeArray)
    #set the expected difference
    minDif = timedelta(minutes=15)
    #management vars
    curTime = datetime.now()
    timeBlockArray = []
    curBlockStart = datetime.now()
    curBlockEnd = datetime.now()

    #go through every entry
    for time in timeArray:
        startTime = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
        endTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        if (endTime - curTime) != minDif:
            #if this is the first don't add last one
            if not first:
                timeBlockArray.append({'tut_email':time['tut_email'],
                'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                'type': "time",
                'title': "Available Time with " + time['tut_email']})
            else:
                first = False
            #add time to the blockArray
            curBlockStart = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
            curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        else:
            #add 15 minutes to the block
            curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        if left == 1:
            timeBlockArray.append({'tut_email':time['tut_email'],
                'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                'type': "time",
                'title': "Available Time with " + time['tut_email']})
        #hold the new time
        curTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        left-=1
    
    return timeBlockArray
        
def splitTimes(timeToSplit):
    startSplit = datetime.strptime(timeToSplit['start'], '%Y-%m-%dT%H:%M:%S')
    endSplit = datetime.strptime(timeToSplit['end'], '%Y-%m-%dT%H:%M:%S')
    curEnd = startSplit + timedelta(minutes=15)
    splitTimeArray = []

    #go through the time until the end
    while curEnd < endSplit:
        print(curEnd)
        splitTimeArray.append({
        'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
        'end':datetime.strftime(curEnd, '%Y-%m-%dT%H:%M:%S')})
        startSplit = curEnd
        curEnd = startSplit + timedelta(minutes=15)
    #put last time in array
    splitTimeArray.append({
    'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
    'end':datetime.strftime(endSplit, '%Y-%m-%dT%H:%M:%S')})
    return splitTimeArray