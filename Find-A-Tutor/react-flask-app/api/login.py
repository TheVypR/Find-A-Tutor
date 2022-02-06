from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

import profile

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
    sql = cursor.execute("select student_id from Student where email = \""
                            + info[0] + "\" and password = \""
                            + info[1] + "\"")
    user = cursor.fetchone()
    print(user)
    conn.close()

    if(user):
      return {'id': user[0]}
    else:
      return {'error': "NOT FOUND"}

@app.route('/myProfile/', methods=['GET', 'POST'])
def myProfile():
  profile.edit_profile()