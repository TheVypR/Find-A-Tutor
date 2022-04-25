#FIND-A-TUTOR ~ Appointment Management Backend ~ Author: Isaac A.
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used to connect to DB
from datetime import datetime

#setup Flask
app = Flask(__name__)

#setup DB
mysql = MySQL()

#toggle for accessing the DB on a local machine
locality = 1 # Have locality set to 1 if you want to test on your local machine
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

#add appointment to DB
#data -> tutor email, class for appointment, original timeblock start and end, tutor name
#email -> student email
#start -> appointment start time
#end -> appointment end time
#timeslots -> array of 15 minute time blocks that are being taken
def addAppointment(data, email, start, end, timeslots):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    #create the entry in the Appointment table
    cursor.execute("insert into Appointment(stu_email, tut_email, class_code, start_date, end_date, title, block_start, block_end) values(\""
                    + email + "\", \"" 
                    + data['tut_email'] + "\", \"" 
                    + data['class_code'] + "\",'" 
                    + start + "', '"
                    + end + "', \""
                    + "Appointment for " + data['class_code'] + " with " + data['tut_name'] + "\",\"" 
                    + data['block_start'] + "\", \"" 
                    + data['block_end'] + "\")")
    
    #go through every block in timeslots
    for time in timeslots:
        #mark time as taken for the tutor
        cursor.execute("update TutorTimes set taken = true where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + time['start'] + "\"")
    
    #close the DB connection
    conn.close()
    
    #return success
    return 'SUCCESS', 200

#get the rates for a tutor
#data -> tutor email
def getRates(tutor, email):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #init the dictionary for rates
    tutorRates = {}
    
    #get the rates for the tutor's classes
    cursor.execute("select T.class_code, T.rate from TutorClasses T, StudentClasses S where T.tut_email = (%s) and S.stu_email = (%s) and T.class_code = S.class_code", (tutor, email))
    classRates = cursor.fetchall()
    #put the rates into the dictionary (key -> class_code, value -> rate)
    for clss in classRates:
        tutorRates[clss[0]] = clss[1]
    
    #return the class_code -> rate dictionary
    return tutorRates, 200

#get verification status
def getVerification(tutor, email):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #init the dictionary for rates
    tutorVerify = {}
    
    #get the rates for the tutor's classes
    cursor.execute("select T.class_code, T.verified from TutorClasses T, StudentClasses S where T.tut_email = (%s) and S.stu_email = (%s) and T.class_code = S.class_code", (tutor, email))
    classRates = cursor.fetchall()
    #put the rates into the dictionary (key -> class_code, value -> verified status)
    for clss in classRates:
        tutorVerify[clss[0]] = clss[1]
    
    #return the class_code -> rate dictionary
    return tutorVerify, 200    

#get the classes a student is taking
def getStuClasses(token):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #init the array of classes
    classes = []
    
    #get the classes for the student
    cursor.execute("select class_code from StudentClasses where stu_email in (select stu_email from Student where token = \"" + token +"\")")
    classList = cursor.fetchall()

    #add classes to array
    for clss in classList:
        classes.append(clss[0])
    
    #return dictionary with array of classes (fetch calls want a dictionary)
    return {'stu_classes':classes}, 200

#get the available times available with tutors
#only returns tutor's who teach classes that overlap with the students taken classes
def getTimes(email):
    #init the times array
    availTimes = []
        
    #connect to the DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get the times
    cursor.execute("select T.tut_email, start_date, end_date, taken, P.tut_name, P.rating" + 
                    " from TutorTimes T, Tutor P" + 
                    " where T.tut_email in (select tut_email from TutorClasses where class_code in" + 
                    " (select class_code from StudentClasses where stu_email = \"" + email + "\")) and T.tut_email = P.tut_email")
    times = cursor.fetchall()
    if times:
        #put times into array of dictionaries
        for time in times:
            classes = []            
            #if the time isn't already taken by an appointment
            if time[3] == 0 and datetime.strptime(time[2], "%Y-%m-%dT%H:%M:%S") > datetime.now() and email != time[0]:
                #add a dictionary to the array
                availTimes.append({'tut_email':time[0],
                                   'start':time[1],
                                   'end':time[2],
                                   'classes':list(getRates(time[0], email)[0].keys()),
                                   'title': "Available Session with " + time[4],
                                   'tut_name':time[4],
                                   'rating':time[5],
                                   'type':"time",
                                   'backgroundColor':'green',                     #changes the event's color on the calendar
                                   })
  
        #close the connection
        conn.close()
                
        #return the times
        return availTimes
    else:
        return "No times found"

#get the appointments for a student or tutor
#isTutor -> whether the person is a student or tutor
def getAppointments(token, isTutor):
    #init the array of appointments
    availAppts = []
    
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #if this a student request
    if not isTutor:
        #get the appointments for a given student
        cursor.execute("select " 
                        +"appt_id, "
                        +"A.stu_email, "
                        +"A.tut_email, "
                        +"class_code, "
                        +"start_date, "
                        +"end_date, "
                        +"title, "
                        +"block_start, "
                        +"block_end, "
                        +"S.stu_name, "
                        +"T.tut_name from Appointment A, Student S, Tutor T where A.stu_email = (select stu_email from Student where token = \"" + token + "\")" 
                        +"and S.token = \"" + token + "\""
                        +"and T.tut_email = A.tut_email")
                        
        appts = cursor.fetchall()

        #put appointments in a dictionary and add to array
        for appt in appts:
            if datetime.strptime(appt[4], "%Y-%m-%dT%H:%M:%S") > datetime.now():
                availAppts.append({
                    'stu_email':appt[1],
                    'stu_name':appt[9],
                    'tut_email':appt[2],
                    'tut_name':appt[10],
                    'class_code':appt[3], 
                    'start':appt[4],
                    'end':appt[5],
                    'title':appt[6],
                    'block_s':appt[7],
                    'block_e':appt[8],
                    'type':"appt",
                    'backgroundColor':'blue',   #changes the event's color on the calendar
                    })
    else:
        #get the appointments for a given tutor
        cursor.execute("select " 
                        +"appt_id, "
                        +"A.stu_email, "
                        +"A.tut_email, "
                        +"class_code, "
                        +"start_date, "
                        +"end_date, "
                        +"'Meeting with ', "
                        +"block_start, "
                        +"block_end, "
                        +"S.stu_name, "
                        +"T.tut_name from Appointment A, Student S, Tutor T where A.tut_email = (select stu_email from Student where token = \"" + token + "\")" 
                        +"and T.tut_email = (select stu_email from Student where token = \"" + token + "\")"
                        +"and S.stu_email = A.stu_email")    
                        
        appts = cursor.fetchall()
                        
        #put appointments in a dictionary and add to array
        for appt in appts:
            if datetime.strptime(appt[4], "%Y-%m-%dT%H:%M:%S") > datetime.now():
                availAppts.append({
                    'stu_email':appt[1],
                    'stu_name':appt[9],
                    'tut_email':appt[2],
                    'tut_name':appt[10],
                    'class_code':appt[3], 
                    'start':appt[4],
                    'end':appt[5],
                    'title':appt[6] + appt[9],
                    'block_s':appt[7],
                    'block_e':appt[8],
                    'type':"appt",
                    'backgroundColor':'blue',   #changes the event's color on the calendar
                    })
    
    #close the connection
    conn.close()
    
    #return the appointments
    return {'appts':availAppts}, 200

#get the group tutoring sessions
def getGroupTutoring(email):
    tutoringAry = []
    groupTutSes= []
    #connect to the DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get class code
    cursor.execute("select class_code from StudentClasses where stu_email = \"" + email + "\"")
    classes = cursor.fetchall()
    for cls in classes:
        cursor.execute("select title, location, department, start_time, end_time from GroupTutoring where department like CONCAT('%', SUBSTRING('" + cls[0] + "', 1, 4) , '%')")
        results = cursor.fetchall()
        if results not in groupTutSes:
            groupTutSes.append(results)
    print(groupTutSes)
    for session in groupTutSes:
        for ses in session:
            tutoringAry.append({'title':ses[0], 'location':ses[1], 'department':ses[2], 'start':ses[3], 'end':ses[4], 'backgroundColor':'purple'})
    return {'groupTut':tutoringAry}, 200
    
#cancel an appointment with a tutor
#data -> appointment info
#dates -> the formated start and end of the appointment
#slots -> the tutor time slots to make available again
def removeAppointment(email, data, dates, slots, view):
    #connect to the DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    if view == "tutor":
        #remove the appointments for the given student, with the given tutor, at the given time
        cursor.execute("delete from Appointment where tut_email= \"" 
                    + email + "\" and stu_email=\"" 
                    + data['email'] + "\" and start_date=\"" 
                    + dates['start'] + "\"")

        #go through the slots
        for slot in slots:
            #mark each slot as available again
            cursor.execute("update TutorTimes set taken = false where tut_email = \"" 
                            + email + "\" and start_date = \"" + slot['start'] + "\"")

    else:
        #remove the appointments for the given student, with the given tutor, at the given time
        cursor.execute("delete from Appointment where tut_email= \"" 
                    + data['email'] + "\" and stu_email=\"" 
                    + email + "\""
                    + " and start_date=\"" 
                    + dates['start'] + "\"")
                    
        #go through the slots
        for slot in slots:
            #mark each slot as available again
            cursor.execute("update TutorTimes set taken = false where tut_email = \"" 
                            + data['email'] + "\" and start_date = \"" + slot['start'] + "\"")
    
    #close the connection
    conn.close()
    
    #return success
    return 'SUCCESS', 200