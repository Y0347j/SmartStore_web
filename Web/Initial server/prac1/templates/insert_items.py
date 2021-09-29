import pymysql

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database_setup import Base

engine = create_engine('mysql+pymysql://root:root@localhost/SmartStore')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession() # DB 연결

#display_stand1 =