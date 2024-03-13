from sqlalchemy import text

from dao.engine import Session


def data_timespan_service():
    """
    获取数据的时间跨度，去除2000年之前的数据
    """
    session = Session()
    sql = text("SELECT MIN(time), MAX(time) FROM all_data WHERE time > '2000-01-01'")
    query = session.execute(sql).fetchall()
    session.close()

    # 转为字符串yyyy-mm-dd hh:mm:ss
    start_time = str(query[0][0])
    end_time = str(query[0][1])
    result = {
        "from": start_time,
        "to": end_time
    }
    return result
