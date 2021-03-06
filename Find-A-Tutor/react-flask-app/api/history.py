#FIND-A-TUTOR ~ Appointment History Backend ~ Authors: Isaac A., Aaron S.
from datetime import datetime   #used to compare dates
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used for DB connection

#flask setup
app = Flask(__name__)

#DB setup
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

#retrieve all the appointments a student has attended previously
def loadPreviousAppointmentsStudent(token):
    #init appointment array
    apptHistory = []
    
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    #get all appointments for a student
    cursor.execute("select * from Appointment where stu_email = (select stu_email from Student where token = \"" + token + "\")")
    history = cursor.fetchall()
    
    #go through each appointment
    for appt in history:
        #check if appointment was earlier than now
        if datetime.strptime(appt[4], "%Y-%m-%dT%H:%M:%S") < datetime.now():
            #add appointment to appointment history
            apptHistory.append({'with': appt[2], 'class': appt[3], 'time': appt[4], 'id': appt[0]})
            
    #close connection
    conn.close()
    
    #return appointment history for student
    return {'appts': apptHistory}, 200

#retrieve all the appointments a tutor has attended previously
def loadPreviousAppointmentsTutor(token):
    #init appointment array
    apptHistory = []
    
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    #get all appointments for a tutor
    cursor.execute("select * from Appointment where tut_email = (select stu_email from Student where token = \"" + token + "\")")
    history = cursor.fetchall()
    
    #go through each appointment
    for appt in history:
        #check if appointment was earlier than now
        if datetime.strptime(appt[4], "%Y-%m-%dT%H:%M:%S") < datetime.now():
            #add appointment to appointment history
            apptHistory.append({'with': appt[1], 'class': appt[3], 'time': appt[4], 'id': appt[0]})
    
    #close connection
    conn.close()
    
    #return appointment history for tutor
    return {'appts': apptHistory}, 200

#give a rating to a tutor
def submitRating(data):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get the current rating a tutor has
    cursor.execute("select rating, rating_count from Tutor where tut_email = \"" + data['target'] + "\"")
    rating_tuple = cursor.fetchone()
    rating = 0
    rate_count = 0
    
    if len(rating_tuple) == 2:
        rating = rating_tuple[0]
        rate_count = rating_tuple[1]

    #average the rating for the tutor
    newRate = int(((rating * rate_count) + data['rate']) / rate_count)
    
    #put the updated rating in the table
    cursor.execute("update Tutor set rating = " + str(newRate) + " where tut_email = \"" + data['target'] + "\"")
    
    #return success
    return "SUCCESS", 200

#report a student for misconduct
def submitStudentReport(data, email):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #put report into ReportedStudents table
    cursor.execute("insert into ReportedStudents(stu_email, reported_by, reason, report) values (\"" 
                        + data['target'] + "\", \""
                        + email + "\", \""
                        + data['reason'] + "\", \""
                        + data['report'] + "\")")
    
    #return success
    return "SUCCESS", 200

#report a tutor for misconduct
def submitTutorReport(data, email):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #put report into ReportedTutors table
    cursor.execute("insert into ReportedTutors(tut_email, reported_by, reason, report) values (\"" 
                        + data['target'] + "\", \""
                        + email + "\", \""
                        + data['reason'] + "\", \""
                        + data['report'] + "\")")
    
    #return success
    return "SUCCESS", 200