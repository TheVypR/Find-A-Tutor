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
    cursor.execute("insert into Appointment(stu_email, tut_email, class_code, start_date, end_date, title, block_start, block_end) values(\"" 
                    + email + "\", \"" 
                    + data['tut_email'] + "\", \"" 
                    + data['class_code'] + "\",'" 
                    + start + "', '"
                    + end + "', \""
                    + "Appointment for " + data['class_code'] + " with " + data['tut_name'] + "\",\"" 
                    + data['block_start'] + "\", \"" 
                    + data['block_end'] + "\")")
    
    for time in timeslots:
        cursor.execute("update TutorTimes set taken = true where tut_email = \"" 
                        + data['tut_email'] + "\" and start_date = \"" + time['start'] + "\"")
    
    conn.close()

    return 'Done'

def getRates(data):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    tutorRates = {}
    
    cursor.execute("select class_code, rate from TutorClasses where tut_email = \"" + data +"\"")
    classRates = cursor.fetchall()
    print(classRates)
    for clss in classRates:
        tutorRates[clss[0]] = clss[1]
    
    return tutorRates

def getTimes(email):
    availTimes = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    cursor.execute("select TT.tut_email, start_date, end_date, taken, T.tut_name, T.rating" + 
                    " from TutorTimes TT, Tutor T" + 
                    " where TT.tut_email in (select tut_email from TutorClasses where class_code in" + 
                    " (select class_code from StudentClasses where stu_email = \"" + email + "\")) and TT.tut_email = T.tut_email;")
    times = cursor.fetchall()
    for time in times:
        if time[3] == 0:
            availTimes.append({'tut_email':time[0], 
                               'start':time[1],
                               'end':time[2],
                               'title': "Available Session with " + time[4],
                               'tut_name':time[4],
                               'rating':time[5],
                               'type':"time",
                               'backgroundColor':'#00ff00',
                               'borderColor':'#00ff00'})
    
    conn.close()
    return availTimes
    
def getAppointments(email):
    availAppts = []
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
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
    appts = cursor.fetchall()
    
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
            'backgroundColor':'##0000ff',
            'borderColor':'#0000ff'})
    
    conn.close()
    print(availAppts)
    return {'appts':availAppts}
    
def removeAppointment(email, data, dates, slots):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()  
    
    cursor.execute("delete from Appointment where stu_email=\"" 
                    + email + "\" and tut_email=\"" 
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