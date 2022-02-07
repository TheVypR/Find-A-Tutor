import hashlib

from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

locality = 0 # have locality set to 1 if you want to test on your local machine
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

@app.route('/login/', methods=['POST'])
def login():
    #sql setup
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    #get the login provided
    info = request.get_json()
    
    #get the salt
    cursor.execute("select stu_salt from Student where stu_email = \""
                            + info[0] + "\"")
                            
    result = cursor.fetchone()
    
    salt = bytes.fromhex(result[0])
    
    password = hashlib.pbkdf2_hmac(
        'sha256', # The hash digest algorithm for HMAC
        info[1].encode('utf-8'), # Convert the password to bytes
        salt, # Provide the salt
        100000 #100,000 iterations of SHA-256 
    )
    
    password = salt + password
    
    cursor.execute("select stu_email from Student where stu_email = \""
                            + info[0] + "\" and stu_pass = \""
                            + password.hex() + "\"")
    user = cursor.fetchone()
    print(user)
    conn.close()

    if(user):      
      return user[0]
    else:
      return "USER NOT FOUND"