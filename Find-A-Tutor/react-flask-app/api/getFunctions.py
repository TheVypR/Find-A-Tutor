from flask import Flask, request, jsonify

# database stuff
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

# get name from email
def getName(email):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select stu_name from Student where stu_email = \""+email+"\"")
    name = cursor.fetchone()
    conn.close()
    return name