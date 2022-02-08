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

def appointment(title, start_time, end_time):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    print(title)
    
    cursor.execute("insert into Appointments(appointment_id, stu_email, tut_email, class_code, start_time, end_time, title)" 
                    + " values(25, \"apelia18@gcc.edu\", \"sickafuseaj18@gcc.edu\", \"COMP447A\",'" 
                    + start_time + "', '"
                    + end_time + "', \""
                    + title + "\")")
    
    conn.close()

    return 'Done'

def getTimes():
    availTimes = [{}]
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("select * from TutorTimes")
    times = cursor.fetchall()
    
    for time in times:
        availTimes.append({'title':time[0], 'start':time[1], 'end':time[2]})
    
    return availTimes