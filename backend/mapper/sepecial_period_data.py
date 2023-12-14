from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

"""
    从all_data表中查询数据
    接受两个时间参数，返回一个列表
    返回时间在这两个时间之间的所有数据
    表格式：
        id(int), 
        tid(varchar), 
        time(timestamp), 
        lon(decimal), 
        lat(decimal), 
        speed(int), 
        direction(int)

"""

# 创建连接引擎
engine = create_engine('mysql+pymysql://root:123456@taxi.kina0630.top:3306/db_taxi')

# 创建基类
Base = declarative_base()


# 定义映射类
class period_data(Base):
    # 指定本类映射到users表
    __tablename__ = 'all_data'

    # 指定id映射到id字段
    id = Column(Integer, primary_key=True)
    tid = Column(String(20))
    time = Column(String(20))
    lon = Column(String(20))
    lat = Column(String(20))
    speed = Column(Integer)
    direction = Column(Integer)


# 从all_data表中查询数据
# 接受两个时间参数，返回一个列表
# 返回时间在这两个时间之间的所有数据

def query_data_between_times(start_time, end_time):
    # 创建会话类
    Session = sessionmaker(bind=engine)
    session = Session()
    # 查询数据
    data = session.query(period_data).filter(period_data.time.between(start_time, end_time)).all()
    # 关闭会话
    session.close()

    print(len(data))
