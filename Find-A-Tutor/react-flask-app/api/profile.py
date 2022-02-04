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

@app.route('/myProfile/', methods=['GET'])
def retrieve_profile():
    tutor_id = 1
#    conn = mysql.connect()
   cursor = conn.cursor()
    
    #get the tutor information from the DB
    #get the name
    cursor.execute("select name from Tutor where tutor_id = (%s)", (tutor_id))
    name = cursor.fetchone()
    print(name)
    
    #get the email
    cursor.execute("select email from Tutor where tutor_id = (%s)", (tutor_id))
    email = cursor.fetchone()
    print(email)
    
    #get the classes and rates
    cursor.execute("select class_code, rate from TutorRates where tutor_id = (%s)", (tutor_id))
    classes_rates = cursor.fetchall()
    
    for classCode in classes_rates:
        print(classCode[0])
        print(classCode[1])        
        # #do something with the tuple (print it?)
    
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
        
    return {'name': "Tim Warner", 'email': "trwarner18@gcc.edu"}  
    
@app.route('/myProfile/', methods=['POST'])
def edit_profile():
    tutor_id = 1
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    get the new information
    submission = request.get_json()
    info = submission[0]
    classes = submission[1]
    
    update the profile
    cursor.execute("update Tutor set name = \"" 
                    + info['name'] + "\", log_in_as_tutor = \"" 
                    + info['login_pref'] + "\", contact_me = \"" 
                    + info['contact_me'] + "\", payment_type = \"" 
                    + info['payment_type'] + "\", payment_details = \"" 
                    + info['payment_details'] + "\" where tutor_id = " 
                    + tutor_id)
                    
    delete the classes and rates
    cursor.execute("delete from TutorRates where tutor_id = " + tutor_id) 
    
    #add the new classes and rates
    for c in classes:
        cursor.execute("insert into TutorRates(tutor_id, class_code, rate) values(" 
                    + tutor_id + ", class_code = \"" 
                    + c['class_code'] + "\", rate = \"" 
                    + c[rate] + "\")")
                    
    print(info['payInfo'])
