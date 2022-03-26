from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from pymysql import NULL
from wtforms import BooleanField
#from MySQLdb import escape_string as thwart

#error constants


#Database stuff
from flaskext.mysql import MySQL
import json
import login

import numpy as np

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

#retrieve profile details
def retrieve_profile(token, isTutor):
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the tutor information from the DB
    cursor.execute("select stu_name, stu_email from Student where token = \"" + token + "\"")
    data = cursor.fetchone()
    if not data:
        return 'Profile not Found', 404
    name = data[0]
    email = data[1]

    #get classes
    cursor.execute("select class_code from StudentClasses where stu_email=(%s)", (email))
    classesTaking = cursor.fetchall()
    #select class_code from StudentClasses where stu_email="apelia18@gcc.edu";

    #get the login preference
    cursor.execute("select login_pref from Tutor where tut_email = (%s)", (email))
    loginPref = cursor.fetchone()
    
    #get the contactability
    cursor.execute("select contactable from Tutor where tut_email = (%s)", (email))
    contactable = cursor.fetchone()
    
    #get the payment
    cursor.execute("select pay_type, pay_info from Tutor where tut_email = (%s)", (email))
    payment = cursor.fetchone()
    
    #split the payment details
    if payment == None:
        payment_method = "Cash"
        payment_details = ""
    else:
        payment_method = payment[0]  #payment_type
        payment_details = payment[1] #payment_info

    times = retrieve_times(email)
    tutorsFor = retrieve_classes(email)
    print(tutorsFor)

    #login prefs are an array, make it just a single int
    if loginPref == None:
        loginPref = 1
    else:
        loginPref = loginPref[0]
  
    conn.close()

    return {'name': name, 'email':email, 'isTutor': True,
        'login_pref':loginPref, 'contact':contactable,
        'pay_type':payment_method, 'pay_info':payment_details,
        'times': times, 'tutorsFor': tutorsFor, 'classesTaking': classesTaking}

    
    #if so retrieve tutor info
    # if isTutor:
    #     return retrieve_tutor(name, email)
    # elif not isTutor:
    #     return retrieve_student(name, email)
    # else:
    #     return ''

#retrieve student details
def retrieve_student(name, tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()

    #get classes
    cursor.execute("select class_code from StudentClasses where stu_email=(%s)", (tut_email))
    classes = cursor.fetchone()
    #select class_code from StudentClasses where stu_email="apelia18@gcc.edu";

    conn.close()

    return {'name': name, 'email': tut_email, 'classes': classes, 'isTutor': False}

#retrieve tutor details
def retrieve_tutor(name, tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the login preference
    cursor.execute("select login_pref from Tutor where tut_email = (%s)", (tut_email))
    loginPref = cursor.fetchone()
    
    #get the contactability
    cursor.execute("select contactable from Tutor where tut_email = (%s)", (tut_email))
    contactable = cursor.fetchone()
    
    #get the payment
    cursor.execute("select pay_type, pay_info from Tutor where tut_email = (%s)", (tut_email))
    payment = cursor.fetchone()
    
    #split the payment details
    if payment == None:
        payment_method = "Cash"
        payment_details = ""
    else:
        payment_method = payment[0]  #payment_type
        payment_details = payment[1] #payment_info

    times = retrieve_times(tut_email)
    classes = retrieve_classes(tut_email)

    #login prefs are an array, make it just a single int
    if loginPref == None:
        loginPref = 1
    else:
        loginPref = loginPref[0]
  
    return {'name': name, 'email':tut_email, 'isTutor': True,
        'login_pref':loginPref, 'contact':contactable,
        'pay_type':payment_method, 'pay_info':payment_details,
        'times': times, 'classes': classes}, 200

#retrieve the times the tutor is available
def retrieve_times(tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    availTimes = []
    
    #get the times
    cursor.execute("select start_date, end_date from TutorTimes where tut_email = (%s)", (tut_email))
    times = cursor.fetchall()

    
    #put times in dict {start_time:end_time}
    if len(times) != 0:
        for time in times:
            startAndEnd = {'start': time[0], 'end': time[1]}
            availTimes.append(startAndEnd)

        #Condense times
        availTimes = login.mergeTimes(availTimes)
    else:
        availTimes = []
    
    return availTimes, 200


#retrieve the classes they tutor and their rates
def retrieve_classes(tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    classes = []
    #get the classes and rates
    cursor.execute("select class_code, rate from TutorClasses where tut_email = (%s)", (tut_email))
    classes_rates = cursor.fetchall()
    
    #put the classes in a dict 
    #classes[["code", rate:15], ["code2", 10]]
    for pair in classes_rates:
        classes.append(np.asarray(pair))
    print(classes)
    
    return classes

# Submit time slots to db for given weekday
def post_timeSlot(times, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    #loop through times and run this query for each 15 minute slot
    for time in times:
        cursor.execute("insert into TutorTimes values(\"" + tut_email +
                        "\",\""+ time['start'] +
                        "\",\""+ time['end'] +
                        "\",false)")

    conn.close()
    return 'SUCCESS', 200

def remove_timeSlot(times, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #Check type of remove
    if ('removePrefilledTime' not in times.keys()):
        #loop through times and run this query for each 15 minute slot
        for time in times:
            cursor.execute("delete from TutorTimes where tut_email=\'" + tut_email + "\' and start_date=\'" + time['start'] + "\';")

    conn.close()
    
    return 'SUCCESS', 200

def contactMe_change(contactMe, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    c = 1

    cursor.execute("update Tutor set contactable=\'%s\' where tut_email=%s;", (c, tut_email,))

    conn.close()
    return 'SUCCESS', 200

def edit_profile(submission, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #update the profile
    cursor.execute("update Tutor set"
                    + " pay_type = \"" + submission['pay_type'] + "\"" 
                    + ", pay_info = \"" + submission['pay_info'] + "\""
                    + ", login_pref = \'" + str(submission['login_pref'])
                    + "\' where tut_email=\'" + tut_email + "\';")

    #update the tutor classes
    
    classes = submission['classes']

    for aClass in classes:
        if 'class_code' in aClass.keys():
            cursor.execute("insert into TutorClasses Values(%s, %s, %s, %s);", (tut_email, aClass['class_code'], aClass['rate'], 0))

    conn.close()
    return 'SUCCESS', 200

def remove_tutor(tutor):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("select tut_email from Appointment where tut_email = \"" + tutor + "\" ")

    data = cursor.fetchone()

    retStr = ""
    if data != None:
        retStr = 'Done'
    else:
        cursor.execute("delete from ReportedTutors where tut_email = \""+ tutor +"\" ")
        cursor.execute("delete from TutorTimes where tut_email = \""+ tutor + "\" ")
        cursor.execute("delete from TutorClasses where tut_email = \""+ tutor + "\" ")
        cursor.execute("delete from Tutor where tut_email = \""+ tutor + "\" ")
        retStr = 'Done'
    
    conn.close()
    return 'SUCCESS', 200