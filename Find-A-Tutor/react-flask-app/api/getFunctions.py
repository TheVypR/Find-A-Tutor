#FIND-A-TUTOR ~ Retrieval Functions ~ Author: Aaron S.
from flask import Flask, request, jsonify   #used for Flask API
from flaskext.mysql import MySQL            #used to connect to DB

#flask setup
app = Flask(__name__)

#DB setup
mysql = MySQL()

#toggle for accessing the DB on a local machine
locality = 1 # have locality set to 1 if you want to test on your local machine
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

# get name from DB with a provided email
######### DEPRECATED FUNCTION ##########
## REASON: Slow due to establishing connection separately ##
## FIX: Change dependent functions to get name in their queries ##
######### DEPRECATED FUNCTION ##########
def getName(email):
    #establish connection to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #grab the student name related to the provided email
    cursor.execute("select stu_name from Student where stu_email = \""+email+"\"")
    name = cursor.fetchone()
    
    #close connection
    conn.close()
    
    #return the student name
    return name