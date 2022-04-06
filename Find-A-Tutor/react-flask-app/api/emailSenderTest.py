import smtplib, ssl
from email.mime.text import MIMEText
from adminRoutes import verifyRequestRetrieval
from socket import gaierror

print("I am here")
#may eventually change this
sender_email = "fnadatutor@gmail.com" 
user = "444ac41e260bc8"
password = "8aa42ef7a4fbf5"


#who to send email to
receiver_email = "njbeam@gmail.com"
host = "smtp.mailtrap.io"
port = 2525

#body of email
print("I am here above message")
message = f"""\
Subject: Hello Subject
To: {receiver_email}
From: {sender_email}

This is a test email """
print("I am here above email sender")
try:
    server = smtplib.SMTP(host, port)
    print("I am here above login")
    server.login(user, password)
    print("I am here after login")
    server.sendmail(sender_email, receiver_email, message)
    # tell the script to report if your message was sent or which errors need to be fixed
    print('Sent')
    server.quit()
except (gaierror, ConnectionRefusedError):
    print('Failed to connect to the server. Bad connection settings?')
except smtplib.SMTPServerDisconnected:
    print('Failed to connect to the server. Wrong user/password?')
except smtplib.SMTPException as e:
    print('SMTP error occurred: ' + str(e))