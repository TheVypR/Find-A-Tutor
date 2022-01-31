from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

locality = 1 # Use 1 for local testing and 0 for vm
if(locality == 1):
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

@app.route('/StudentProfile/', methods=['GET','POST'])
def StudentProfile():

    #Code for name stored in database from signup screen
    info = {'name': 'testing', 'email': 'test@test.test'}
    print(info)
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Student(student_id, email, name) values(2, \"" + info['email'] + "\", \"" + info['name'] + "\")")

    #Code for email on profile screen
    student_id = 4
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select email, name from Student where student_id = (%s)", student_id)
    data = cursor.fetchone()

    print(data)

    
    
    return "yay"
    