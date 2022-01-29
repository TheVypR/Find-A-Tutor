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
    app.config['MYSQL__DATABASE_HOST'] = 'localhost'
    app.config['MYSQL_DATABASE_USER'] = 'trwarner00'
    app.config['MYSQL_DATABASE_PASSWORD'] = 'Timothy21!'
    app.config['MYSQL_DATABASE_DB'] = 'findatutor'

mysql.init_app(app)
#end database stuff

@app.route('/myProfile/')
def profile():

    #Code for name stored in database from signup screen
    #info = {'name': 'Jerry', 'email': 'Springer@thebest.best'} #request.get_json()
    #print(info)    
    #conn = mysql.connect()
    #conn.autocommit(True)
    #cursor = conn.cursor()
    #data = cursor.execute("INSERT INTO Student(student_id, email, name) values(2, \"" + info['name'] + "\", \"" + info['email'] + "\")")

    #Code for user can see their email on their screen
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("SELECT name, email from Student where student_id = 4;")
    data = cursor.fetchall()

    print(data)
    
    return "yay"  
    