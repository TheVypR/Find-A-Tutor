import os
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
#end database stuff

#class ProfileForm(FlaskForm):
    #loginAs = BooleanField("Login as Tutor: ", validators=[Optional()])

@app.route('/signup/', methods=['POST'])
def signup():
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    info = request.get_json()    
    print(info)
    #get salt
    salt = os.random(32)
    
    #hash password
    key = hashlib.pbkdf2_hmac(
        'sha256', # The hash digest algorithm for HMAC
        info[3].encode('utf-8'), # Convert the password to bytes
        salt, # Provide the salt
        100000 #100,000 iterations of SHA-256 
    )
    
    password = salt + key
    
    cursor.execute("insert into Student(stu_email, stu_name, stu_pass, stu_salt) values (\"" 
                    + info[2] + "\", \"" 
                    + info[0] + " " + info[1] +"\", \"" 
                    + password + "\", \"" 
                    + salt + "\")")
    
    conn.close()

    return 'Done'

    