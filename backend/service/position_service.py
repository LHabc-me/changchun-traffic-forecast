from sqlalchemy import text

from service.engine import Session


def position_service(timespan):
    """
    获取时间段内的位置信息
    :param timespan: 时间段
    """
    session = Session()
    sql = text("SELECT lon, lat FROM all_data "
               "WHERE time BETWEEN :start_time AND :end_time")
    query = session.execute(
        sql,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()
    result = []
    for i in range(len(query)):
        result.append([query[i][0], query[i][1]])
    return result
