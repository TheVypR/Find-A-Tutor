from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

locality = 0 # have locality set to 1 if you want to test on your local machine
if (locality):
    app.config['MYSQL_DATABASE_HOST'] = '10.18.110.181'
    app.config['MYSQL_DATABASE_USER'] = 'test'
    app.config['MYSQL_DATABASE_PASSWORD'] = 'C0dePr0j$'
    app.config['MYSQL_DATABASE_DB'] = 'findatutor'
else:
    app.config['mysql_database_host'] = 'localhost'
    app.config['mysql_database_user'] = 'trwarner00'
    app.config['mysql_database_password'] = 'timothy21!'
    app.config['mysql_database_db'] = 'findatutor'

mysql.init_app(app)
#end database stuff

#class ProfileForm(FlaskForm):
    #loginAs = BooleanField("Login as Tutor: ", validators=[Optional()])

@app.route('/signup/', methods=['POST'])
def profile():
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    info = request.get_json()    
    print(info)
    print(info[0])
    print(info[1])
    print(info[2])
    print(info[3])
    cursor.execute("insert into Student(student_id, email, name) values (1, \"" + info['email'] + "\", \"" + info['name'] +"\")")
    
    conn.close()

    return 'Done'

    