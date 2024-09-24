from sqlalchemy import text

from dao.engine import Session


def position_service(timespan):
    """
    获取时间段内的位置信息
    :param timespan: 时间段
    """
    session = Session()
    sql = text("""
        SELECT ST_X(geometry) AS lon, ST_Y(geometry) AS lat
        FROM all_data
        WHERE time BETWEEN :start_time AND :end_time
    """)
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
