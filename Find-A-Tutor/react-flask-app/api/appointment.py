#FIND-A-TUTOR ~ Appointment Management Backend ~ Author: Isaac A.
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used to connect to DB

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
    return 'Done'

#get the rates for a tutor
#data -> tutor email
def getRates(data):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #init the dictionary for rates
    tutorRates = {}
    
    #get the rates for the tutor's classes
    cursor.execute("select class_code, rate from TutorClasses where tut_email = \"" + data +"\"")
    classRates = cursor.fetchall()
    
    #put the rates into the dictionary (key -> class_code, value -> rate)
    for clss in classRates:
        tutorRates[clss[0]] = clss[1]
    
    #return the class_code -> rate dictionary
    return tutorRates

#get the classes a student is taking
def getStuClasses(email):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #init the array of classes
    classes = []
    
    #get the classes for the student
    cursor.execute("select class_code from StudentClasses where stu_email = \"" + email +"\"")
    classList = cursor.fetchall()

    #add classes to array
    for clss in classList:
        classes.append(clss[0])
    
    #return dictionary with array of classes (fetch calls want a dictionary)
    return {'stu_classes':classes}

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
                    " (select class_code from StudentClasses where stu_email = \"" + email + "\")) and T.tut_email = P.tut_email;")
    times = cursor.fetchall()
    
    #put times into array of dictionaries
    for time in times:
        classes = []            
        #if the time isn't already taken by an appointment
        if time[3] == 0:
            #add a dictionary to the array
            availTimes.append({'tut_email':time[0],
                               'start':time[1],
                               'end':time[2],
                               'classes':list(getRates(time[0]).keys()),
                               'title': "Available Session with " + time[4],
                               'tut_name':time[4],
                               'rating':time[5],
                               'type':"time",
                               'backgroundColor':'#00ff00',                     #changes the event's color on the calendar
                               'borderColor':'#00ff00'})                        #changes the event's color on the calendar

    #close the connection
    conn.close()
        
    #return the times
    return availTimes

#get the appointments for a student or tutor
#isTutor -> whether the person is a student or tutor
def getAppointments(email, isTutor):
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
                        +"T.tut_name from Appointment A, Student S, Tutor T where A.stu_email = \"" + email + "\"" 
                        +"and S.stu_email = \"" + email + "\""
                        +"and T.tut_email = A.tut_email")
    else:
        #get the appointments for a given tutor
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
                        +"T.tut_name from Appointment A, Student S, Tutor T where A.tut_email = \"" + email + "\"" 
                        +"and T.tut_email = \"" + email + "\""
                        +"and S.stu_email = A.stu_email")    
    appts = cursor.fetchall()
    
    #put appointments in a dictionary and add to array
    for appt in appts:
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
            'backgroundColor':'##0000ff',   #changes the event's color on the calendar
            'borderColor':'#0000ff'})       #changes the event's color on the calendar
            
    #close the connection
    conn.close()
    
    #return the appointments
    return {'appts':availAppts}

#cancel an appointment with a tutor
#data -> appointment info
#dates -> the formated start and end of the appointment
#slots -> the tutor time slots to make available again
def removeAppointment(email, data, dates, slots):
    #connect to the DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    #remove the appointments for the given student, with the given tutor, at the given time
    cursor.execute("delete from Appointment where stu_email=\"" 
                    + email + "\" and tut_email=\"" 
                    + data['tut_email'] + "\" and start_date=\"" 
                    + dates['start'] + "\"")
    
    #go through the slots
    for slot in slots:
        #mark each slot as available again
        cursor.execute("update TutorTimes set taken = false where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + slot['start'] + "\"")
    
    #close the connection
    conn.close()
    
    #return success
    return "Done"