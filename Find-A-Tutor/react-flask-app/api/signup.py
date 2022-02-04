import imp
from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

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
    print(info[0])
    print(info[1])
    print(info[2])
    print(info[3])
    cursor.execute("insert into Student(student_id, email, name, password) values (8576489, \"" + info[2] + "\", \"" + info[0] + " " + info[1] +"\", \"" + info[3] + "\")")
    
    conn.close()

    return 'Done'