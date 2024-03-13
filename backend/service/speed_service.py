from sqlalchemy import text

from dao.engine import Session


def speed_service(timespan):
    session = Session()
    sql = text("SELECT speed FROM all_data "
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
    for i in query:
        result.append(i)
    return result
