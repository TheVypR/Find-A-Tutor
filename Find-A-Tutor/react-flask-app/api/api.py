from flask import Flask
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

app.config['MYSQL_DATABASE_HOST'] = '10.18.110.181'
app.config['MYSQL_DATABASE_USER'] = 'test'
app.config['MYSQL_DATABASE_PASSWORD'] = 'C0dePr0j$'
app.config['MYSQL_DATABASE_DB'] = 'findatutor'

mysql.init_app(app)

#Add comment for test commit and push
@app.route('/start/', methods=['GET'])
def start():

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Professors")
    data = cursor.fetchall()
    
    print(data)

    return "yay"