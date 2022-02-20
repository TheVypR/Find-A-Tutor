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

def addAppointment(data, email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    print(data)
    cursor.execute("insert into Appointment(stu_email, tut_email, class_code, start_date, end_date, title) values(\"" 
                    + email + "\", \"" 
                    + data['tut_email'] + "\", \"" 
                    + data['class_code'] + "\",'" 
                    + data['start'] + "', '"
                    + data['end'] + "', \""
                    + "Appointment for " + data['class_code'] + " with " + data['tut_email'] + "\")")
    
    conn.close()

    return 'Done'

def getTimes(email):
    availTimes = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("select tut_email, start_date, end_date" + 
                    " from TutorTimes" + 
                    " where tut_email in (select tut_email from TutorClasses where class_code in" + 
                    " (select class_code from StudentClasses where stu_email = \"" + email + "\"));")
    times = cursor.fetchall()
    
    for time in times:
        availTimes.append({'title':time[0], 'start':time[1], 'end':time[2], 'type':"time"})
    
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
    
def removeAppointment(email, data, newDates):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("delete from Appointment where stu_email=\"" 
                    + data['stu_email'] + "\" and tut_email=\"" 
                    + data['tut_email'] + "\" and start_date=\"" 
                    + newDates['start'] + "\"")
    print("Closing..")
    conn.close()
    
    return "Success"