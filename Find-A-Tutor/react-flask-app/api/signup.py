#FIND-A-TUTOR ~ SignUp backend ~ Author: Isaac A.
import os                           #used for random byte generation
import random                       #used for random string generation
import string                       #used for controlling random string gen
import hashlib                      #used to hash pw
from base64 import b64encode        #used to encode/decode pw
from flask import Flask             #used for Flask API
from flaskext.mysql import MySQL    #used to connect to DB

#flask setup
app = Flask(__name__)

#DB setup
mysql = MySQL()

#toggle for accessing the DB on a local machine
locality = 1 #have locality set to 1 if you want to test on your local machine
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

#Hash the given password then
#add the user's email, name, hashed password, and permissions to DB
def signup(info):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #create the password salt
    salt = os.urandom(32)
    
    #hash the password
    password = hashlib.pbkdf2_hmac(
        'sha256',                   # The hash digest algorithm for HMAC
        info[3].encode('utf-8'),    # Convert the password to bytes
        salt,                       # Provide the salt
        100000                      #100,000 is standard for SHA-256 
    )
    
    #combine password and salt
    password = salt + password
    
    #generate a token
    token = ""
    for i in range(64):
        token += random.choice(string.ascii_letters)
    
    #insert data into DB
    cursor.execute("insert into Student(stu_email, stu_name, stu_pass, stu_salt, isAdmin, token) values (\"" 
                    + info[2] + "\", \"" 
                    + info[0] + " " + info[1] +"\", \"" 
                    + password.hex() + "\", \"" 
                    + salt.hex() + "\", "
                    + "false, \"" 
                    + token + "\")")
    
    #close the connection
    conn.close()
    
    #confirm completion
    return 'DONE', 200