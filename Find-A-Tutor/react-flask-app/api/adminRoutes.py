#FIND-A-TUTOR ~ Admin Backend ~ Authors: Aaron S., Isaac A.
import random
import string
from flask import Flask, jsonify   #used for Flask API
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
    return jsonify(returnArray), 200

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
    return jsonify(returnArray), 200

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
    return jsonify(allTutors), 200

#retrieve all tutors who can be contacted for times not shown on calendar
def Contactable(token):
    print(token)
    #connect to DB
    conn = mysql.connect()
    cursor = conn.cursor()
    
    #get students that can be contacted for availability
    cursor.execute("select tut_email, tut_name from Tutor" +
                    " where contactable = 1 "
                    +"and tut_email in (select tut_email from TutorClasses where class_code in" 
                    +" (select class_code from StudentClasses where stu_email in (select stu_email from Student where token = \"" 
                    + token + "\") and tut_email not in (select stu_email from Student where token = \"" + token + "\")))")
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
    return jsonify(returnArray), 200

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
    return jsonify(allBanned), 200

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
    return 'SUCCESS', 200

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
    return 'SUCCESS', 200


#adds a user to the Tutor table
#thereby making them a tutor
def BecomeATutor(email):
    #set the default pay method
    pay = "Cash"

    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #add student to Tutor table
    cursor.execute("insert into Tutor values(\""+ email 
                    + "\", (select stu_name from Student where stu_email = \"" + email 
                    + "\"), \""+pay+"\", \"""\", 0, 0, 0 )")
    #close the connection
    conn.close()
    
    #return success
    return 'SUCCESS', 200

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

def EditTutoring(data):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()

    if data[6]:
        cursor.execute("insert into GroupTutoring values(0, \""+data[1]+ "\", \""+data[2]+ "\", \""+data[3]+ "\", \""+data[4]+ "\", \""+data[5]+ "\")")
    else:
        #add student to Tutor table
        cursor.execute("update GroupTutoring set title = \""+ data[1] 
            + "\", location = \""+ data[2] + "\", department = \""+ data[3] 
            + "\", start_time = \""+ data[4] + "\", end_time = \""+ data[5] 
            + "\" where session_id = %s;", data[0])
        #close the connection
    conn.close()
    
    #return success
    return 'SUCCESS', 200

#submits the tutors request for verification
def submitVerifyRequest(email, class_code):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #generate a new code
    code = ""
    for i in range(64):
        code += random.choice(string.ascii_letters)
        
    #store the submission
    cursor.execute("insert into VerificationRequest values(\"" 
                    + email + "\", \""
                    + class_code + "\", "
                    +"(select prof_email from Classes where class_code = \"" + class_code + "\"), \""
                    + code + "\"")
    
    #close the connection
    conn.close()
    
    #return success
    return 'SUCCESS', 200
    
#get the information for the email
def verifyRequestRetrieval():
    #request array
    requestArray = []
    
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get the tutor name, tutor email, code, class code, and professor email
    cursor.execute("select R.prof_email, R.tut_email, T.tut_name, R.class_code, R.approve_code from VerificationRequest R, Tutor T")
    requests = cursor.fetchall()
    
    #put requests in an array of dictionaries
    for request in requests:
        requestArray.append({'prof_email':request[0], 'tut_email':request[1], 'tut_name':request[2], 'class_code':request[3], 'approve_code':request[4]})
    
    #return the array of requests
    return {'requests':requestArray}, 200
    
#approve a student's request
def approveVerification(approve_code):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get the tutor and class to approve
    cursor.execute("select tut_email, class_code from VerificationRequest where approve_code = \"" + approve_code + "\"")
    request = cursor.fetchone()
    
    #mark the tutor as verified for that class
    cursor.execute("update TutorClasses set verified = true where tut_email = \"" + request[0] + "\" and class_code = \"" + request[1] + "\"")
    
    #remove the request
    removeVerificationRequest(request[0], request[1])
    
    #return success
    return 'SUCCESS', 200
    
#deny a student's request
def denyVerification(deny_code):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    #get the tutor and class to deny
    cursor.execute("select tut_email, class_code from VerificationRequest where approve_code = \"" + deny_code + "\"")
    request = cursor.fetchone()
    
    #delete request from DB
    removeVerificationRequest(request[0], request[1])
    
#remove request from table
def removeVerificationRequest(tut_email, class_code):
    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    
    cursor.execute("delete from VerificationRequest where tut_email = \"" + tut_email + "\" and class_code = \"" + class_code + "\"")
    
    return 'SUCCESS', 200
