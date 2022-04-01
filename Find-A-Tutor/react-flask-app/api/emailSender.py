import smtplib, ssl

def sendEmail():
    #for SSL
    port = 465
    smtp_server = "smtp@gmail.com"

    #may eventually change this
    sender_email = "FnadATutor@gmail.com"  

    #This will change to query required email from professor
    #or pass in as parameter when queried in another file
    receiver_email = "njbeam@gmail.com"  
    
    #password input
    password = "3mbara$$inglyParallel" 

    #body of email
    message = "This is a test"

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
