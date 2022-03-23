from flask import Flask, jsonify
from flaskext.mysql import MySQL

#setup flask
app = Flask(__name__)

#setup DB
mysql = MySQL()

#toggle for accessing the DB on a local machine
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

def checkLogIn(token):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #check if a token was given
    if token:    
        #check if the given token is associated with a student
        cursor.execute("select stu_email from Student where token = \"" + token + "\"")
        email = cursor.fetchone()
        
        if email:
            return jsonify({'loggedIn':True})
        else:
            return jsonify({'loggedIn':False})
    else:
        return jsonify({'loggedIn':False})
    
def getEmail(token):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #check if a token is given
    if token:
        #check if the given token is associated with a student
        cursor.execute("select stu_email from Student where token = \"" + token + "\"")
        email = cursor.fetchone()
        return email[0]
    else:
        return "NO TOKEN"