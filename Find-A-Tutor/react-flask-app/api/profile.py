#FIND-A-TUTOR ~ Profile Backend ~ Authors: Tim W., Isaac A.
from flask import Flask, request, jsonify
from flask_wtf import FlaskForm
from flask_wtf import Form
from pymysql import NULL
from wtforms import BooleanField

#from MySQLdb import escape_string as thwart

#error constants


#Database stuff
from flaskext.mysql import MySQL
import json
import login,timeManager

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
#End of DB Setup



#retrieve profile details
def retrieve_profile(token):
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
    allClasses = retrieve_allClasses()

    #login prefs are an array, make it just a single int
    if loginPref == None:
        loginPref = 1
    else:
        loginPref = loginPref[0]
  
    conn.close()

    return {'name': name, 'email':email, 'isTutor': True,
        'login_pref':loginPref, 'contact':contactable,
        'pay_type':payment_method, 'pay_info':payment_details,
        'times': times,'moments': times, 'tutorsFor': tutorsFor, 'classesTaking': classesTaking, "allClasses": allClasses}, 200

def retrieve_times(tut_email):
    """Get the times the tutor is available from the DB

    Format the times into a dictionary {'start', 'end'}
    Send that dictionary to login.mergeTimes
    return the result of mergeTimes
    If the Tutor does not have any available times return an empty array
    """

    #Connect to Db
    conn = mysql.connect()
    cursor = conn.cursor()

    availTimes = [] #array of times the tutor is available tutor
    
    #get the times
    cursor.execute("select start_date, end_date from TutorTimes where tut_email = (%s)", (tut_email))
    times = cursor.fetchall()

    #put times in dict {'start', 'end'}
    if len(times) != 0:
        for time in times:
            startAndEnd = {'start': time[0], 'end': time[1]}
            availTimes.append(startAndEnd)

        #Condense times
        availTimes = timeManager.mergeTimes(availTimes)
    else:
        availTimes = []
    
    return availTimes


def retrieve_classes(tut_email):
    """Gets the classes the Tutor tutors and the rates for each class from the DB

    Get the classes from the db
    then put them into an array of dictionaries [{'class_code', 'rate'}, ]
    """

    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()

    classes = [] # array which each class will be added to aClass = {'class_code', 'rate'}

    #get the classes and rates
    cursor.execute("select class_code, rate, verified from TutorClasses where tut_email = (%s)", (tut_email))
    classes_rates = cursor.fetchall()
    
    #put the classes in an array of dicts [{'class_code', 'rate'}, ]
    for cls in classes_rates:
        cursor.execute("select tut_email from VerificationRequest where tut_email = (%s) and class_code = (%s)", (tut_email, cls[0]))
        hasRequested = cursor.fetchone()
        newTuple = ({"class_code": cls[0], "rate": cls[1], "verification": cls[2]})
        if hasRequested:
            newTuple = ({"class_code": cls[0], "rate": cls[1], "verification": 5})

        classes.append(newTuple)
    
    conn.close()
    return classes

def retrieve_allClasses():
    """Gets all the classes stored in the DB"""

    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the tutor information from the DB
    cursor.execute("SELECT class_code FROM Classes;")
    allClasses = cursor.fetchall()

    conn.close()
    return allClasses

# Submit time slots to db for given weekday
def post_timeSlot(times, tut_email):
    """ Send the tutor's available times to the db for a given weekday
    """

    #Connect to DB
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
    """Remove a timeslot from the Tutor's available times

    Timeslots are either added during the current session by the user or
    are retrieved from the DB.
    """
    print(times)

    #Connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #Check type of remove
    #loop through times and run this query for each 15 minute slot
    for time in times:
        cursor.execute("delete from TutorTimes where tut_email=\'" + tut_email + "\' and start_date=\'" + time['start'] + "\';")
    conn.close()
    
    return 'SUCCESS', 200

def remove_classes(classes, tut_email):
    """Remove classes that the tutor tutors for

    """

    #Connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #Check type of remove
    #loop through times and run this query for each 15 minute slot
    for cls in classes:
        cursor.execute("delete from TutorClasses where tut_email=\'" + tut_email + "\' and class_code=\'" + cls['class_code'] + "\';")
    conn.close()
    
    return 'SUCCESS', 200

def contactMe_change(contactMe, tut_email):
    """ Send boolean value to DB for if the Tutor is able to be contacted to set up a Tutoring session.
    """

    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    c = contactMe # 0=cannot be contacted by students 1=can be contacted

    #query db
    cursor.execute("update Tutor set contactable=\'%s\' where tut_email=%s;", (c, tut_email,))

    conn.close()
    return 'SUCCESS', 200

def edit_profile(submission, tut_email):
    """Update DB from changes made by the Tutor

    When the Tutor hits apply update the DB with changed info for
    type of payment (cash, vemo, paypal),
    username for payment serivice (if applicable),
    and whether the default to loggin in as a Tutor or Student (0=student, 1=tutor).
    Also, update the classes they tutor.
    """

    #Connect to DB
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

    #check if any classes were removed
    print(len(submission['removeClasses']))
    if len(submission['removeClasses']) > 0:
        remove_classes(submission['removeClasses'], tut_email)

    #Loop through the Tutor's classes 
    #if the class has a class_code add it to the DB
    #There can be empty elements in the array so these are not added to the DB
    for aClass in classes:
        if 'class_code' in aClass.keys():
            cursor.execute("insert into TutorClasses Values(%s, %s, %s, %s);", (tut_email, aClass['class_code'], aClass['rate'], 0))

    conn.close()
    return 'SUCCESS', 200

def edit_student_classes(submission, tut_email) :
    '''Updates classes the student is taking'''
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    #update the classes the student is taking
    classes = submission['classesTaking']

    #loop through each class added and insert it into the db
    for aClass in classes:
        cursor.execute("insert into StudentClasses Values(%s, %s);", (tut_email, aClass))

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

def isTutor(email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    tutor = False
    try:
        print(email)
        cursor.execute("select tut_email from Tutor where tut_email = \"" + email + "\"")
        isTutor = cursor.fetchone()
        print(isTutor)
        if isTutor:
            tutor = True
        else:
            tutor = False
    except:
        return "SQL ERROR", 400
        
    return jsonify(tutor), 200