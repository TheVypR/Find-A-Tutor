import smtplib, ssl
from email.mime.text import MIMEText
from flask import Flask         #used for Flask API
from flaskext.mysql import MySQL#used for DB connection
from adminRoutes import verifyRequestRetrieval


#may eventually change this
sender_email = "fnadatutor@gmail.com" 

#This will change to query required email from professor
#or pass in as parameter when queried in another file


#get the requests
requests = verifyRequestRetrieval()[0]

user = "444ac41e260bc8"
password = "8aa42ef7a4fbf5"

#go through and send email for each request
for request in requests['requests']:
    #who to send email to
    receiver_email = request['prof_email']
    verifyLink = "localhost:3000/" + request['approve_code']
    
    #body of email
    message = MIMEText("Hello, a student " + request['tut_name'] + ", has requested your verification to tutor for " + request['class_code'] + ", please click the link below to accept this verification")

    message['Subject'] = 'Find-A-Tutor Verification Request'
    message['From'] = 'fnadatutor@gmail.com'
    message['To'] = request['prof_email']

    message = f"""\
Subject: Hello Subject
To: {receiver_email}
From: {request['prof_email']}

Hello, a student {request['tut_name']}, has requested your verification to tutor for {request['class_code']}, please click the link below to accept this verification

{verifyLink}
 """

    #send mail
try:
    with smtplib.SMTP("smtp.mailtrap.io", 2525) as server: 

        server.login(user, password)
        server.sendmail(sender_email, receiver_email, message)
        server.quit()
except (gaierror, ConnectionRefusedError):
    print('Failed to connect to the server. Bad connection settings?')
except smtplib.SMTPServerDisconnected:
    print('Failed to connect to the server. Wrong user/password?')
except smtplib.SMTPException as e:
    print('SMTP error occurred: ' + str(e))