import smtplib, ssl
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used for DB connection
from adminRoutes import verifyRequestRetrieval

#flask setup
app = Flask(__name__)

#def sendEmail():
#for SSL
port = 465
smtp_server = "smtp.gmail.com"

#may eventually change this
sender_email = "fnadatutor@gmail.com" 

#This will change to query required email from professor
#or pass in as parameter when queried in another file

#password input
password = "3mbara$$inglyParallel"

#get the requests
requests = verifyRequestRetrieval()[0]

#go through and send email for each request
for request in requests['requests']:
    #who to send email to
    receiver_email = request['prof_email']
    
    #body of email
    message = "Hello, a student {request['tut_name']}, has requested your verification to tutor for {request['class_code']}, please click the link below to accept this verification"

    #Look into adding subject header
    #Subject: "Verification Request - Find a Tutor"

    #send mail
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server) as server:
        #Identify yourself to server
        server.ehlo()

        #server.starttls(context=context)

        #Identify yourself to server
        server.ehlo()  

        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
        server.quit()
