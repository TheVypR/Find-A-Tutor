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

def loadPreviousAppointmentsStudent(email):
    apptHistory = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    cursor.execute("select * from Appointment where stu_email = \"" + email + "\"")
    history = cursor.fetchall()
    
    for appt in history:
        apptHistory.append({'with': appt[2], 'class': appt[3], 'time': appt[4]})
    
    conn.close()

    return {'appts': apptHistory}
    
def loadPreviousAppointmentsTutor(email):
    apptHistory = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    cursor.execute("select * from Appointment where tut_email = \"" + email + "\"")
    history = cursor.fetchall()
    
    for appt in history:
        apptHistory.append({'with': appt[1], 'class': appt[3], 'time': appt[4]})
    
    conn.close()

    return {'appts': apptHistory}