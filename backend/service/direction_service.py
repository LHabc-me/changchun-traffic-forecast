from sqlalchemy import text

from dao.engine import Session


def direction_service(timespan):
    session = Session()
    sql = text("SELECT direction FROM all_data "
               "WHERE time BETWEEN :start_time AND :end_time")
    query = session.execute(
        sql,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()

    return list(map(lambda x: x[0], query))
