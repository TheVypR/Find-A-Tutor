#FIND-A-TUTOR ~ Admin Backend ~ Authors: Aaron S., Isaac A.
from flask import Flask, request, jsonify   #used for Flask API
from flaskext.mysql import MySQL            #used to connect to DB

#Flask setup
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

#retrieve the reports about tutors
def ReportedTutors():
    #conenct to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get reports
    cursor.execute("select RT.*, T.tut_name, S.stu_name from ReportedTutors RT, Tutor T, Student S where RT.tut_email = T.tut_email and RT.reported_by = S.stu_email")
    allTutors = cursor.fetchall()
    
    #close connection
    conn.close()
    
    #init array of reports
    returnArray = list(allTutors)
    LSize = 0
    
    #go through each report and organize
    for tutor in returnArray:
        returnArray[LSize] = list(tutor)
        reportedTutorName = tutor[5]
        reportedByName = tutor[6]
        returnArray[LSize].append(reportedTutorName)
        returnArray[LSize].append(reportedByName)
        LSize += 1

    #return array of reports
    return jsonify(returnArray)

#retrieve the students that have been reported
def ReportedStudents():
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get all the students reports
    cursor.execute("select RS.*, T.tut_name, S.stu_name from ReportedStudents RS, Tutor T, Student S where RS.stu_email = S.stu_email and RS.reported_by = T.tut_email")
    allTutors = cursor.fetchall()
    
    #close the connection
    conn.close()

    #init array of reports
    returnArray = list(allTutors)
    LSize = 0
    
    #go through each report and organize
    for tutor in returnArray:
        returnArray[LSize] = list(tutor)
        reportedTutorName = tutor[5]
        reportedByName = tutor[6]
        returnArray[LSize].append(reportedTutorName)
        returnArray[LSize].append(reportedByName)
        LSize += 1

    #return the array of reports
    return jsonify(returnArray)

#get all current Tutors in the DB
def CurrentTutors():
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get all tutors
    cursor.execute("select * from Tutor")
    allTutors = cursor.fetchall()
    
    #close connection
    conn.close()
    
    #return all tutors in DB
    return jsonify(allTutors)

#retrieve all tutors who can be contacted for times not shown on calendar
def Contactable(email):
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get students that can be contacted for availability
    cursor.execute("select tut_email, tut_name from Tutor" +
                    " where contactable = 1 "
                    +"and tut_email in (select tut_email from TutorClasses where class_code in" 
                    +" (select class_code from StudentClasses where stu_email = \"" + email + "\") and tut_email != \"" + email + "\")")
    contactTuts = cursor.fetchall()
    
    #close the connection
    conn.close()
    
    #init the array of tutors
    returnArray = []
    LSize = 0
    
    #make an array of dictionaries from the tutors found
    for tutor in contactTuts:
        returnArray.append({'tut_email':tutor[0], 'tut_name':tutor[1]})
    
    #return contactable tutors
    return jsonify(returnArray)

#get all the users that have been banned
def BannedStudents():
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get all banned users
    cursor.execute("select * from BannedUsers")
    allBanned = cursor.fetchall()
    
    #close connection
    conn.close()
    
    #return banned students
    return jsonify(allBanned)

#mark a user as being banned
#target -> user to be banned's info
def AddStudentToBan(target):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #put user in banned table
    cursor.execute("insert into BannedUsers(stu_email, stu_name, reason, ban_id) values(\""
                    + target['stu_email'] + "\", (select stu_name from Student where stu_email = \"" 
                    + target['stu_email'] + "\"), \""
                    + target['reason'] + "\", 0)")

    # determining if the user is a tutor
    cursor.execute("select tut_email from Tutor where tut_email = \""+ target['stu_email'] + "\" ")
    data = list(cursor.fetchone())

    # delete from all tables if student is a tutor
    ban = "Banned@vac_ban.edu"
    if data != None:
        cursor.execute("update Appointment set tut_email = \""+ban+"\" where tut_email = \""+ target['stu_email'] +"\" ")
        cursor.execute("delete from ReportedTutors where tut_email = \""+ target['stu_email'] +"\" ")
        cursor.execute("delete from TutorTimes where tut_email = \""+ target['stu_email'] + "\" ")
        cursor.execute("delete from TutorClasses where tut_email = \""+ target['stu_email'] + "\" ")
        cursor.execute("delete from Tutor where tut_email = \""+ target['stu_email'] + "\" ")

    # delete from all student tables as well
    cursor.execute("update Appointment set stu_email = \""+ban+"\" where stu_email = \""+ target['stu_email'] + "\" ")
    cursor.execute("delete from ReportedStudents where stu_email = \""+ target['stu_email'] +"\" ")
    cursor.execute("delete from StudentClasses where stu_email = \""+ target['stu_email'] + "\" ")
    cursor.execute("delete from Student where stu_email = \""+ target['stu_email'] + "\" ")

    # close the connection
    conn.close()

    # delete from reported users list
    DeleteUserFromList(target)
    
    #return success
    return 'Done'

#delete a report from the reported list
#target -> report info
def DeleteUserFromList(target):
    #determine what table to remove report from
    table = ""
    if target['table'] == "students":
        table = "ReportedStudents"
    elif target['table'] == "tutors":
        table = "ReportedTutors"

    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #delete report from table
    cursor.execute("delete from "+ table +" where report_id = " + str(target['id']))
    
    #close connection
    conn.close()
    
    #return success
    return 'Done'


def BecomeATutor(student):
    #set the default pay method
    pay = "Cash"

    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #add student to Tutor table
    cursor.execute("insert into Tutor values(\""+ student['stu_email'] 
                    + "\", (select stu_name from Student where stu_email = \"" + student['stu_email'] 
                    + "\"), \""+pay+"\", \"""\", 0, 0, 0 )")
    #close the connection
    conn.close()
    
    #return success
    return 'Done'

#get a list of group tutoring from the backend
def GroupTutoringList():
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get all group tutoring items
    cursor.execute("select * from GroupTutoring")
    allGroup = cursor.fetchall()
    
    #close connection
    conn.close()
    
    #return banned students
    return jsonify(allGroup)