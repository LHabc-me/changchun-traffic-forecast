from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime


def query_data_between_times(start_time, end_time):
    # 创建数据库连接引擎（请根据你的数据库配置进行修改）
    engine = create_engine('mysql+pymysql://root:123456@taxi.kina0630.top:3306/db_taxi')

    # 创建会话
    Session = sessionmaker(bind=engine)
    session = Session()

    # 构建原始SQL查询
    sql_query = text("SELECT * FROM all_data WHERE time BETWEEN :start_time AND :end_time")

    # 执行查询
    result = session.execute(sql_query, {'start_time': start_time, 'end_time': end_time})

    # 处理结果
    # for row in result.fetchall():
    #     print(row)
    print(len(result.fetchall()))

    # 关闭会话
    session.close()
