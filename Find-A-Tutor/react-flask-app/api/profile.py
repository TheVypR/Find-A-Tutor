from flask import Flask, request

from flask_wtf import FlaskForm
from flask_wtf import Form
from wtforms import BooleanField

#Database stuff
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

app.config['MYSQL__DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'trwarner00'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Timothy21!'
app.config['MYSQL_DATABASE_DB'] = 'findatutor'

mysql.init_app(app)
#end database stuff

#class ProfileForm(FlaskForm):
    #loginAs = BooleanField("Login as Tutor: ", validators=[Optional()])

@app.route('/myProfile/')
def profile():
    #form=ProfileForm()
    
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Professors")
    data = cursor.fetchone()
    print(data)
    
    return "yay"  
    