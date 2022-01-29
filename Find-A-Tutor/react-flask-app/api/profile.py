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

@app.route('/myProfile/')
def profile():
    tutor_id = 1
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get the tutor information from the DB
    #get the name
    cursor.execute("select name from Tutor where tutor_id = (%s)", (tutor_id))
    name = cursor.fetchone()
    print(name)
    
    #get the email
    cursor.execute("select email from Tutor where tutor_id = (%s)", (tutor_id))
    email = cursor.fetchall()
    print(email)
    
    #get the classes and rates
    cursor.execute("select class_code, rate from TutorRates where tutor_id = (%s)", (tutor_id))
    classes_rates = cursor.fetchall()
    
    for classCode in classes_rates:
        print(classCode[0])
        print(classCode[1])        
        #do something with the tuple (print it?)
    
    #get the times
    cursor.execute("select * from TutorTimes where tutor_id = (%s)", (tutor_id))
    times = cursor.fetchall()
    print(times)
    
    #get the login preference
    cursor.execute("select log_in_as_tutor from Tutor where tutor_id = (%s)", (tutor_id))
    loginPref = cursor.fetchone()
    print(loginPref)
    
    #get the contactability
    cursor.execute("select contact_me from Tutor where tutor_id = (%s)", (tutor_id))
    contactable = cursor.fetchone()
    print(contactable)
    
    #get the payment
    cursor.execute("select payment_type, payment_info from Tutor where tutor_id = (%s)", (tutor_id))
    payment = cursor.fetchone()   
    
    #split the payment details
    payment_method = payment[0]  #payment_type
    payment_details = payment[1] #payment_info
    print(payment_method)
    print(payment_details)
    
    
    return {'title': "A Lemon", 'name': payment_method}  
    