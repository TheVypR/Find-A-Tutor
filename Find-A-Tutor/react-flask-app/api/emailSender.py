import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from adminRoutes import verifyRequestRetrieval

key = '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'
#get the requests
requests = verifyRequestRetrieval()[0]


#go through and send email for each request
for request in requests['requests']:
    verify_link = "http://10.18.110.181:3000/approveOrDeny"
    message = Mail(
        from_email='fnadatutor@gmail.com',
        to_emails=request['prof_email'],
        subject='Find-A-Tutor Verification Request for {}'.format(request['tut_email']),
        html_content = '<a href="{}">Click here to verify</a>'.format(verify_link))
        #html_content='Hello, a student {request['tut_name']}, has requested your verification to tutor for {request['class_code']}, please navigate to the link below to accept this verification <a>{verifyLink}</a>')
    try:
        sg=SendGridAPIClient(key)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)
       
    #body of email
    #message = MIMEText("Hello, a student " + request['tut_name'] + ", has requested your verification to tutor for " + request['class_code'] + ", please click the link below to accept this verification")
