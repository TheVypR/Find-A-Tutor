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

@app.route('/addAppointment/', methods=['POST'])
def appointment():
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    info = request.get_json()   
    
    print(info)
    print(info['name'])
    print(info['email'])
    
    cursor.execute("insert into Appointments(student_id, tutor_id, start_time, end_time) values(" 
                    + info['student_id'] + ", " 
                    + info['tutor_id'] + ", '" 
                    + info['start_time'] + "', '"
                    + info['end_time'] + "')")
    
    conn.close()

    return 'Done'

    