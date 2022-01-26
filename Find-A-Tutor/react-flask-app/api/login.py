import os
import sys
from flask import Flask, request, render_template, redirect, url_for, abort
from flask.helpers import flash
#from myforms import ClassForm

from flask_sqlalchemy import SQLAlchemy

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, TimeField
from wtforms.validators import InputRequired

from flask_mysqldb import MySQL
from sqlalchemy import create_engine, text

scriptdir = os.path.dirname(os.path.abspath(__file__))
dbfile = os.path.join(scriptdir, "Classes.db")

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'correcthorsebatterystaple'

database = os.path.join(scriptdir, "Classes.db")

# connect to mysql server
engine = create_engine("mysql://test:C0dePr0j$@10.18.110.181/findatutor")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://test:C0dePr0j$@10.18.110.181/findatutor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Class(db.Model):
    __tablename__ = 'Classes'
    classID = db.Column(db.Integer, primary_key=True)
    classCode = db.Column(db.Unicode, nullable=False)
    startTime = db.Column(db.Unicode, nullable=False)
    endTime = db.Column(db.Unicode, nullable=False)
    professorID = db.Column(db.Integer, nullable=False)
    def __str__(self):
        return f"Class(classID={self.classID}, classCode={self.classCode}, startTime={self.startTime}, endTime={self.endTime}, professorID={self.professorID})"
    def __repr__(self):
        return str(self)

db.create_all()

# define our own FlaskForm subclass for our form
class ClassForm(FlaskForm):
    # include a required name field with the label "Name: "
    classID = IntegerField("Class ID: ", validators=[InputRequired()])
    classCode = StringField("Class Code: ", validators=[InputRequired()])
    startTime = StringField("Start Time: ", validators=[InputRequired()])
    endTime = StringField("End Time: ", validators=[InputRequired()])
    professorID = IntegerField("Professor ID: ", validators=[InputRequired()])
  
    # add a submit button labeld "Submit" to this form
    submit = SubmitField("Submit")

class TutorForm(FlaskForm):
    tutorID = IntegerField("Tutor ID: ", validators=[InputRequired()])
    studentID = IntegerField("Student ID: ", validators=[InputRequired()])
    payment_type = StringField("Payment: ", validators=[InputRequired()])
    payment_info = StringField("Payment Info: ", validators=[InputRequired()])
    fname = StringField("First Name: ", validators=[InputRequired()])
    lname = StringField("Last Name: ", validators=[InputRequired()])
    submit = SubmitField("Submit")

    

@app.route('/')
def launch():
    return render_template('login.j2')

@app.route("/register/", methods=["GET", "POST"])
def register():
    # initialize a copy of the form associated with this route
    cform = ClassForm()
    # check if this is a GET or a POST request
    if request.method == 'GET':
         # if this is a GET request, render the form
        return render_template("addClass.j2", form=cform)
    if request.method == "POST":
        # on POST requests, make sure the submitted form is valid
        if cform.validate():
            data = Class(classID=str(cform.classID.data), classCode=str(cform.classCode.data), startTime=str(cform.startTime.data),
            endTime=str(cform.endTime.data), professorID=str(cform.professorID.data))
            db.session.add(data)
            db.session.commit()
            return redirect(url_for("result"))
        else:
            # the data is not valid flash the error messages then
            # redirect to reload the form
            for field,error in cform.errors.items():
                flash(f"{field}: {error}")
            return redirect(url_for("register"))

@app.route("/myClasses/")
def result():
    #make the connection
    with engine.connect() as connection:
        #everything we need
        sql = text('SELECT T.tutor_fname, T.tutor_lname, T.payment_info, T.payment_type, C.class_code FROM Tutor T INNER JOIN (SELECT tutor_id, class_code FROM TutoredClasses WHERE class_code IN (SELECT class_code FROM TakenClasses WHERE student_id = 254829)) C ON T.tutor_id = C.tutor_id;')
        classes = connection.execute(sql).fetchall()

    #close the connection
    return render_template('result.j2', classes=classes)

@app.route('/addTutor/', methods=["GET", "POST"])
def addTutor():
    form = TutorForm()
    # check if this is a GET or a POST request
    if request.method == 'GET':
         # if this is a GET request, render the form
        return render_template("addTutor.j2", form=form)
    if request.method == "POST":
        # on POST requests, make sure the submitted form is valid
        if form.validate():
            
            engine.connect()

            #add things
            sql = text(f'insert into Tutor (tutor_id, student_id, payment_info, payment_type, tutor_fname, tutor_lname) values ({form.tutorID.data}, {form.studentID.data}, "{form.payment_info.data}", "{form.payment_type.data}", "{form.fname.data}", "{form.lname.data}");')

            add = db.engine.execute(sql)

            engine.dispose()

            return redirect(url_for("addTutor"))
        else:
            # the data is not valid flash the error messages then
            # redirect to reload the form
            for field,error in form.errors.items():
                flash(f"{field}: {error}")
            return redirect(url_for("addTutor"))