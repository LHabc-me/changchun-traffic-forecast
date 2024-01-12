from math import floor

from sqlalchemy import text

from service.engine import Session


def street_service(timespan):
    """
    获取时间段内的位置信息
    :param timespan: 时间段
    """
    session = Session()
    sql = text("""
    select 
        avg(ad."speed") as speed,
        (
            select SUBSTRING(ST_AsText(l.wkb_geometry), 12, length(ST_AsText(l.wkb_geometry)) - 12) from lines l 
            where ad.ogc_fid = l.ogc_fid
        ) as street_geometry 
    from all_data ad
    where 
            ad."time" between :start_time and :end_time
        and 
            ad."speed" > 0
    group by ad.ogc_fid
    """)  # LINESTRING长度为12
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
        level = floor(10 - (query[i][0] / 10))
        geoms = query[i][1].split(',')
        street_geometry = []
        for j in range(len(geoms)):
            point = geoms[j].split(' ')
            street_geometry.append([float(point[1]), float(point[0])])  # lat, lon
        result.append({
            'level': level if level > 0 else 1,
            'street_geometry': street_geometry
        })
        # print(result[i])
    return result
