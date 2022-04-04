import smtplib, ssl
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used for DB connection
from adminRoutes import verifyRequestRetrieval

#flask setup
app = Flask(__name__)

#DB setup
mysql = MySQL()

#toggle for accessing the DB on a local machine
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



def sendEmail():

    #connect to DB
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor() 

    #for SSL
    port = 465
    smtp_server = "smtp@gmail.com"

    #may eventually change this
    sender_email = "FnadATutor@gmail.com" 

    #This will change to query required email from professor
    #or pass in as parameter when queried in another file

   # receiver_email = verifyRequestRetrieval[0]
    receiver_email = "findatutorexampleprofessor@gmail.com"

    #password input
    password = "3mbara$$inglyParallel" 

    #body of email
    message = "Hello, a student {verifyRequestRetrieval[2]}, has requested your verification to tutor for {verifyRequestRetrieval[3]}, please click the link below to accept this verification"

    message['Subject'] = "Find-A-Tutor Verification Request"
    #Look into adding subject header
    #Subject: "Verification Request - Find a Tutor"

    #send mail
    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        #Identify yourself to server
        server.ehlo()

        server.starttls(context=context)

        #Identify yourself to server
        server.ehlo()  

        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
        server.quit()