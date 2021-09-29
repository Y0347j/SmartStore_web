from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base,Manager,Employee,EmployeeCalender,Customer

app = Flask(__name__)

engine = create_engine('mysql+pymysql://root:root@localhost/SmartStore')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession() # DB 연결

# map 사진 위에서 로봇의 위치 실시간으로 update하기
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        return render_template('SmartStore.html')

# 직원 정보 및 출결 달력 보여주는 기능, 편집하는 기능 필요
@app.route('/smartstores/employee/', methods=['GET', 'POST'])
def employee():
    return render_template('employee.html')

# 고객 정보 보여주는 기능, 편집하는 기능 필요
@app.route('/smartstores/cutomer/', methods=['GET', 'POST'])
def customer():
    return render_template('customer.html')

# 진열대의 상품 정보를 보여주는 기능
@app.route('/smartstores/item/', methods=['GET','POST'])
def item():
    return render_template('inventory.html')

# @app.route('/smartstores/login/', methods=['GET','POST'])
# def login():
#     if request.method == 'GET':
#         return render_template('login.html')
#     else:
#         id = request.form['id']
#         pw = request.form['pw']
#         try:
#             data = session.query(Manager).filter_by(id=id, pw=pw).first()
#             if data is not None:
#                 session['logged_in'] = True
#                 return redirect(url_for('home'))
#             else:
#                 return "Don't login"
#         except:
#             return "Don't login"
#
# @app.route('/smartstores/register/', methods=['GET','POST'])
# def register():
#     if request.method == 'GET':
#         return render_template('join.html')
#     else :
#         mgId = request.form['mgId']
#         mgName = request.form['mgName']
#         mgGender = request.form['mgGender']
#         mgPw = request.form['mgPw']
#         conPw = request.form['conPw']
#         phoneNum = request.form['phoneNum']
#         email=request.form['email']
#         print(mgPw)
#
#         if not (mgId and mgName and mgGender and mgPw and conPw and phoneNum and email) :
#             return redirect(url_for('register'))
#         elif mgPw != conPw:
#             return redirect(url_for('register'))
#         else :
#             new_user = Manager(id=mgId, name=mgName, gender=mgGender, pw=mgPw,
#                                confirmPw=conPw, phoneNumber=phoneNum, email=email)
#             session.add(new_user)
#             session.commit()
#         return render_template('login.html')
#
# @app.route('/smartstores/find/', methods=['GET','POST'])
# def find():
#     return "아이디/비밀번호 찾기"
#
# @app.route("/logout")
# def logout():
#     session['logged_in'] = False
#     return redirect(url_for('login'))
s
if __name__ == '__main__':
    app.debug = True
    app.run(host='127.0.0.1', port=5000)