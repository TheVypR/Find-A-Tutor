from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField
#from MySQLdb import escape_string as thwart

#Database stuff
from flaskext.mysql import MySQL

import json

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
def retrieve_profile(email):
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the tutor information from the DB
    #get the name
    cursor.execute("select stu_name from Student where stu_email = (%s)", (email))
    name = cursor.fetchone()
    print(name[0])
    
    #get the email
    cursor.execute("select stu_email from Student where stu_email = (%s)", (email))
    email = cursor.fetchone()
    print(email[0])
        
    return {'name': name, 'email': email}

#retrieve tutor details
def retrieve_tutor(tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the login preference
    cursor.execute("select login_pref from Tutor where tut_email = (%s)", (tut_email))
    loginPref = cursor.fetchone()
    print(loginPref)
    
    #get the contactability
    cursor.execute("select contactable from Tutor where tut_email = (%s)", (tut_email))
    contactable = cursor.fetchone()
    print(contactable)
    
    #get the payment
    cursor.execute("select pay_type, pay_info from Tutor where tut_email = (%s)", (tut_email))
    payment = cursor.fetchone()   
    
    #split the payment details
    payment_method = payment[0]  #payment_type
    payment_details = payment[1] #payment_info
    print(payment_method)
    print(payment_details)
  
    return {'loginPref':loginPref, 'contact':contactable, 'payType':payment_method, 'payInfo':payment_details}

#retrieve the times the tutor is available
def retrieve_times(tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    availTimes = {}
    
    #get the times
    cursor.execute("select start_date, end_date from TutorTimes where tut_email = (%s)", (tut_email))
    times = cursor.fetchall()
    print(times)
    
    #put times in dict {start_time:end_time}
    for time in times:
      availTimes[time[0]] = time[1]
    
    return availTimes

#retrieve the classes they tutor and their rates
def retrieve_classes(tut_email):
    conn = mysql.connect()
    cursor = conn.cursor()
    classes = {}
    #get the classes and rates
    cursor.execute("select class_code, rate from TutorClasses where tut_email = (%s)", (tut_email))
    classes_rates = cursor.fetchall()
    
    #put the classes in a dict {class_code:rate}
    for rate in classes_rates:
      classes[rate[0]] = rate[1]
    
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
    return 'Done'

def remove_timeSlot(times, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #loop through times and run this query for each 15 minute slot
    for time in times:
        cursor.execute("delete from TutorTimes where tut_email=\'" + tut_email + "\' and start_date=\'" + time['start'] + "\';")

    conn.close()
    
    return 'Done'

def contactMe_change(contactMe, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    c = 1

    cursor.execute("update Tutor set contactable=\'%s\' where tut_email=%s;", (c, tut_email,))
    #update Tutor set contactable=1 where tut_email='apelia18@gcc.edu';

    conn.close()
    return 'Done'

def edit_profile(submission, tut_email):
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    #Check for empty values
    # for key in submission.keys():
    #     if (submission)
    
    #update the profile
    cursor.execute("update Tutor set"
                    + " pay_type = \"" + submission['pay_type'] + "\"" 
                    + ", pay_info = \"" + submission['pay_info'] + "\""
                    + ", login_pref = " + str(submission['login_pref'])
                    + " where tut_email = \"" + tut_email + "\";")

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
