import sendgrid
import os
from sendgrid.helpers.mail import *

sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('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'))
from_email = Email("fnadatutor@example.com")
to_email = To("njbeam@gmail.com")
subject = "Sending with SendGrid is Fun"
content = Content("text/plain", "and easy to do anywhere, even with Python")
mail = Mail(from_email, to_email, subject, content)
response = sg.client.mail.send.post(request_body=mail.get())
print(response.status_code)
print(response.body)
print(response.headers)