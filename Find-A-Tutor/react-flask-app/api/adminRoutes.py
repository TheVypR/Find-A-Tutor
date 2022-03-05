from flask import Flask, request, jsonify
#from sqlalchemy import null
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

    returnArray = list(allTutors)
    LSize = 0
    for tutor in returnArray:
        returnArray[LSize] = list(tutor)
        reportedTutorName = getFunctions.getName(tutor[0])
        reportedByName = getFunctions.getName(tutor[1])
        returnArray[LSize].append(reportedTutorName)
        returnArray[LSize].append(reportedByName)
        LSize += 1

    return jsonify(returnArray)

def ReportedStudents():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("select * from ReportedStudents")
    allTutors = cursor.fetchall()
    conn.close()

    returnArray = list(allTutors)
    LSize = 0
    for tutor in returnArray:
        returnArray[LSize] = list(tutor)
        reportedTutorName = getFunctions.getName(tutor[0])
        reportedByName = getFunctions.getName(tutor[1])
        returnArray[LSize].append(reportedTutorName)
        returnArray[LSize].append(reportedByName)
        LSize += 1

    return jsonify(returnArray)

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

    # determining if the user is a tutor
    cursor.execute("select tut_email from Tutor where tut_email = \""+ tutor['stu_email'] + "\" ")
    data = list(cursor.fetchall())


    # delete if student is a tutor
    ban = "Banned@vac_ban.edu"
    if data[0] != null:
        cursor.execute("update Appointment set tut_email = \""+ban+"\" where tut_email = \""+ tutor['stu_email'] +"\" ")
        cursor.execute("delete from TutorTimes where tut_email = \""+ tutor['stu_email'] + "\" ")
        cursor.execute("delete from TutorClasses where tut_email = \""+ tutor['stu_email'] + "\" ")
        cursor.execute("delete from Tutor where tut_email = \""+ tutor['stu_email'] + "\" ")

    # delete from student as well
    cursor.execute("update Appointment set stu_email = \""+ban+"\" where stu_email = \""+ tutor['stu_email'] + "\" ")
    cursor.execute("delete from StudentClasses where stu_email = \""+ tutor['stu_email'] + "\" ")
    cursor.execute("delete from Student where stu_email = \""+ tutor['stu_email'] + "\" ")

    # close the connection
    conn.close()

    # delete from reported users list
    DeleteUserFromList(tutor)

    return 'Done'

def DeleteUserFromList(tutor):
    table = ""
    if tutor['table'] == "students":
        table = "ReportedStudents"
    elif tutor['table'] == "tutors":
        table = "ReportedTutors"

    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    cursor.execute("delete from "+ table +" where report_id = " + str(tutor['id']))
    conn.close()
    return 'Done'
