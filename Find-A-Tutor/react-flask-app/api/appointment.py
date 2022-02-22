from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField
#from MySQLdb import escape_string as thwart

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

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
#end database stuff

#class ProfileForm(FlaskForm):
    #loginAs = BooleanField("Login as Tutor: ", validators=[Optional()])

def addAppointment(data, email, start, end, timeslots):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    print(data['tut_email'])
    cursor.execute("insert into Appointment(stu_email, tut_email, class_code, start_date, end_date, title) values(\"" 
                    + email + "\", \"" 
                    + data['tut_email'] + "\", \"" 
                    + data['class_code'] + "\",'" 
                    + start + "', '"
                    + end + "', \""
                    + "Appointment for " + data['class_code'] + " with " + "sickafuseaj18@gcc.edu" + "\")")
    
    for time in timeslots:
        cursor.execute("update TutorTimes set taken = true where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + time['start'] + "\"")
    
    conn.close()

    return 'Done'

def getTimes(email):
    availTimes = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("select tut_email, start_date, end_date, taken" + 
                    " from TutorTimes" + 
                    " where tut_email in (select tut_email from TutorClasses where class_code in" + 
                    " (select class_code from StudentClasses where stu_email = \"" + email + "\"));")
    times = cursor.fetchall()
    
    for time in times:
        if time[3] == 0:
            availTimes.append({'tut_email':time[0], 'start':time[1], 'end':time[2], 'title': "Available Session with" + time[0], 'type':"time"})
    
    conn.close()
    
    return {'times':availTimes}
    
def getAppointments(email):
    availAppts = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("select * from Appointment where stu_email = \"" + email + "\"")
    appts = cursor.fetchall()
    
    for appt in appts:
        availAppts.append({'stu_email':appt[1], 'tut_email':appt[2], 'class_code':appt[3], 'start':appt[4], 'end':appt[5], 'title':appt[6], 'type':"appt"})
    
    conn.close()
    
    return {'appts':availAppts}
    
def removeAppointment(email, data, dates, slots):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("delete from Appointment where stu_email=\"" 
                    + data['stu_email'] + "\" and tut_email=\"" 
                    + data['tut_email'] + "\" and start_date=\"" 
                    + dates['start'] + "\"")
    
    for slot in slots:
        cursor.execute("update TutorTimes set taken = false where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + slot['start'] + "\"")
    
    conn.close()
    
    return "Success"
    
def editAppointment(email, data, dates, newDates, returnSlots, takeSlots):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    cursor.execute("update Appointment set start_date = " 
                    + newDates['start'] + "\" and end_date = \"" 
                    + newDates['end'] + "\" where stu_email=\"" 
                    + data['stu_email'] + "\" and tut_email=\"" 
                    + data['tut_email'] + "\" and start_date=\"" 
                    + dates['start'] + "\"")
                    
    for slot in returnSlots:
        cursor.execute("update TutorTimes set taken = false where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + slot['start'] + "\"")
    
    for slot in takeSlots:
        cursor.execute("update TutorTimes set taken = true where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + slot['start'] + "\"")
    
    conn.close()
    
    return "Done"