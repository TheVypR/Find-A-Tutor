#FIND-A-TUTOR ~ Profile Backend ~ Authors: Tim W., Isaac A.
from flask import Flask, request
from flask_wtf import FlaskForm
from flask_wtf import Form
from pymysql import NULL
from wtforms import BooleanField
from flaskext.mysql import MySQL
import json
import login

app = Flask(__name__)

#DB Setup
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


# retrieve profile details
def retrieve_profile(token, isTutor):
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the tutor information from the DB
    cursor.execute("select stu_name, stu_email from Student where token = \"" + token + "\"")
    data = cursor.fetchone()
    name = data[0]
    email = data[1]

    conn.close()

    #if so retrieve tutor info
    if isTutor:
        return retrieve_tutor(name, email)
    elif not isTutor:
        return {'name': name, 'email': email, 'isTutor': False}
    else:
        print("Error - isTutor has invalid data")
        return 'Error'

def retrieve_tutor(name, tut_email):
    """Retrieves details pertaining to the users Tutor Profile
    
    Gets their loginPref(0=student, 1=tutor),
    whether they can be contact by students for appointments or not (0=no, 1=yes),
    what payment type they accept (cash, venmo, or paypal),
    what their username for the payment service they use is (if applicable),
    the times they are available to tutor,
    and the classes they tutor for.
    This is then returned as a dictionary
    """

    #Connect to DB
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
    payment_method = payment[0]  #payment_type
    payment_details = payment[1] #payment_info

    #Get the tutor's available times
    times = retrieve_times(tut_email)
    #Get the tutor's classes they tutor
    classes = retrieve_classes(tut_email)

    #login prefs are an array, make it just a single int
    loginPref = loginPref[0]
  
    conn.close()
    return {'name': name, 'email':tut_email, 'isTutor': True,
        'login_pref':loginPref, 'contact':contactable,
        'pay_type':payment_method, 'pay_info':payment_details,
        'times': times, 'classes': classes}

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
        availTimes = login.mergeTimes(availTimes)
    else:
        availTimes = []
    
    conn.close()
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
    cursor.execute("select class_code, rate from TutorClasses where tut_email = (%s)", (tut_email))
    classes_rates = cursor.fetchall()
    
    #put the classes in an array of dicts [{'class_code', 'rate'}, ]
    for pair in classes_rates:
        classes.append(pair)
    
    conn.close()
    return classes

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
    return 'Done'

def remove_timeSlot(times, tut_email):
    """Remove a timeslot from the Tutor's available times

    Timeslots are either added during the current session by the user or
    are retrieved from the DB.
    """

    #Connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #Check type of remove
    if ('removePrefilledTime' not in times.keys()): #remove TimesSlots added during current session
        #loop through times and run this query for each 15 minute slot
        for time in times:
            cursor.execute("delete from TutorTimes where tut_email=\'" + tut_email + "\' and start_date=\'" + time['start'] + "\';")
    #TODO: Implement removal of db populated times

    conn.close()
    
    return 'Done'

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
    return 'Done'

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
    classes = submission['classes'] #submitted classes array [{'class_code', 'rate'}, ]

    #Loop through the Tutor's classes 
    #if the class has a class_code add it to the DB
    #There can be empty elements in the array so these are not added to the DB
    for aClass in classes:
        if 'class_code' in aClass.keys():
            cursor.execute("insert into TutorClasses Values(%s, %s, %s, %s);",
             (tut_email, aClass['class_code'], aClass['rate'], 0))


#     update Tutor
# set pay_type="PayPal", pay_info="user"
# where tut_email="apelia18@gcc.edu";
    #+ "\", log_in_as_tutor = \"" + submission['login_pref'] 
    #+ "\", classes = \"" + submission['classes']

                    
    # #delete the classes and rates
    # cursor.execute("delete from TutorRates where tutor_id = " + tutor_id) 
    
    # #add the new classes and rates
    # for c in classes:
        # cursor.execute("insert into TutorRates(tutor_id, class_code, rate) values(" 
                    # + tutor_id + ", class_code = \"" 
                    # + c['class_code'] + "\", rate = \"" 
                    # + c[rate] + "\")")
                    
    # print(info['payInfo'])

    conn.close()
    return 'Done'