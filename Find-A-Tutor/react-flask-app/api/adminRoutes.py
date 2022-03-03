from flask import Flask, request, jsonify
import getFunctions

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

# functions to get data from database
def ReportedTutors():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select * from ReportedTutors")
    allTutors = cursor.fetchall()
    conn.close()
    return jsonify(allTutors)

def ReportedStudents():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select * from ReportedStudents")
    allTutors = cursor.fetchall()
    conn.close()
    return jsonify(allTutors)

def CurrentTutors():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select * from Tutor")
    allTutors = cursor.fetchall()
    conn.close()
    return jsonify(allTutors)

def BannedStudents():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select * from BannedUsers")
    allBanned = cursor.fetchall()
    conn.close()
    return jsonify(allBanned)

def AddStudentToBan(tutor):
    # get additional info
    name = getFunctions.getName(tutor['stu_email'])

    # post to db
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("insert into BannedUsers(stu_email, stu_name, reason, ban_id) values(\""+ tutor['stu_email'] + "\", \""+ name[0] + "\", \""+ tutor['reason'] + "\", 0)")
    conn.close()

    # delete from reported users list
    DeleteUserFromList(tutor)

    return 'Done'

def DeleteUserFromList(tutor):
    table = ""
    email = ""
    if tutor['table'] == "students":
        table = "ReportedStudents"
        email = "stu_email"
    elif tutor['table'] == "tutors":
        table = "ReportedTutors"
        email = "tut_email"

    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("delete from "+ table + " where " + email + " = \""+ tutor['stu_email'] + "\" ")
    conn.close()
    return 'Done'
