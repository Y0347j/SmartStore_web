import os
import sys
import pymysql
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

# 관리자용 db
class Manager(Base):
    __tablename__='manager'

    id = Column(String(250), primary_key=True)
    name = Column(String(250), nullable=False)
    gender = Column(String(10))
    pw = Column(String(250))
    confirmPw = Column(String(250))
    phoneNumber = Column(String(250), unique=True)
    email = Column(String(250))

    @property
    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'pw': self.pw,
            'confirmPw': self.confirmPw,
            'phoneNumber': self.phoneNumber,
            'email': self.email,
        }

# 직원 용 DB - 직원용 앱과 연동
class Employee(Base):
    __tablename__='employee'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    pw = Column(String(50), nullable=False)


    @property
    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'pw': self.pw,
        }

# class EmployeeCalender(Base):
#     __tablename__='calendar'
#
#     id = Column(Integer, autoincrement=True ,primary_key=True)
#     year = Column(Integer)
#     month = Column(Integer)
#     day = Column(Integer)
#     attendance = Column(String(250), nullable=False)
#     employee_id = Column(Integer, ForeignKey('employee.id'))
#     employee = relationship(Employee)
#
#     @property
#     def serialize(self):
#         return{
#             'id': self.id,
#             'year': self.year,
#             'month': self.month,
#             'day': self.day,
#             'attendance': self.attendance,
#         }

# 고객 용 DB - 고객용 앱과 연동
class Customer(Base):
    __tablename__='customer'

    id = Column(String(250), primary_key=True)
    name = Column(String(250), nullable=False)
    pw = Column(String(250))
    phoneNumber = Column(String(250), unique=True)
    email = Column(String(250), unique=True)
    creditCard = Column(String(250), unique=True)

    @property
    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'pw': self.pw,
            'phoneNumber': self.phoneNumber,
            'email': self.email,
            'creditCard': self.creditCard,
        }

# 상점 진열대 DB 추가
class Store(Base):
    __tablename__ = 'store'

    did = Column(Integer, primary_key=True)
    dLeft = Column(String(250))
    dRight= Column(String(250))

    @property
    def serialize(self):
        return{
            'did': self.did,
            'dLeft': self.dLeft,
            'dRight': self.dRight,
        }

# 창고 진열대 DB 추가
class Warehouse(Base):
    __tablename__ = 'warehouse'

    wid = Column(Integer, primary_key=True)
    wLeft = Column(String(250))
    wRight = Column(String(250))

    @property
    def serialize(self):
        return{
            'wid': self.wid,
            'wLeft': self.wLeft,
            'wRight': self.wRight,
        }

# 상품 제조사 DB
class Manufacture(Base):
    __tablename__='manufacture'

    mid = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    email = Column(String(250))
    phone = Column(Integer)

    @property
    def serialize(self):
        return{
            'mid': self.mid,
            'email': self.email,
            'phone': self.phone,
        }

# 상품 DB
class Item(Base):
    __tablename__ = 'item'

    pid = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    price = Column(Integer) # 가격
    eDate = Column(Integer) # 제조일자
    dLimit = Column(Integer) # 상점 진열대 상품 한계 값 : 2
    dFill = Column(Integer) # 상점 진열대 상품 채울 값 : 4
    wLimit = Column(Integer) # 창고 진열대 상품 한계 값 : 2
    wFill = Column(Integer) # 창고 진열대 상품 채울 값 : 4
    did = Column(Integer, ForeignKey('store.did'))
    store = relationship(Store)
    wid = Column(Integer,ForeignKey('warehouse.wid'))
    warehouse = relationship(Warehouse)
    mid = Column(Integer,ForeignKey('manufacture.mid'))
    manufacture = relationship(Manufacture)

    @property
    def serialize(self):
        return{
            'pid': self.pid,
            'name': self.name,
            'price': self.price,
            'eDate': self.eDate,
            'dLimit': self.dLimit,
            'dFill': self.dFill,
            'wLimit': self.wLimit,
            'wFill': self.wFill,
        }




# 직원 용 앱으로 전송해 줄 위치 정보
class Map(Base):
    __tablename__='map'

    qrCode = Column(String(250), primary_key=True)
    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)

    @property
    def serialize(self):
        return{
            'grCode':self.qrCode,
            'x':self.x,
            'y':self.y,
        }

engine = create_engine('mysql+pymysql://root:root@localhost/smartstore')

Base.metadata.create_all(engine)