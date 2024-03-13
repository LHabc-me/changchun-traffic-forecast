from sqlalchemy import text

from dao.engine import Session
from utils.get_level import get_level


def street_service(timespan, split_mode):
    """
    获取时间段内的位置信息
    :param timespan: 时间段
    :param split_mode: 分割模式
    """
    session = Session()
    table_name = switch_table(split_mode)
    fk = get_street_table_pkname(table_name)
    sql = text(f"""
    select 
        avg(ad."speed") as speed,
        (
            select SUBSTRING(ST_AsText(l.wkb_geometry), 12, length(ST_AsText(l.wkb_geometry)) - 12) from {table_name} l 
            where ad.{fk} = l.{fk}
        ) as street_geometry 
    from all_data ad
    where 
            ad."time" between :start_time and :end_time
        and 
            ad."speed" > 0
    group by ad.{fk}
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
        level = get_level(query[i][0])
        geoms = query[i][1].split(',')
        street_geometry = []
        for j in range(len(geoms)):
            point = geoms[j].split(' ')
            street_geometry.append([float(point[0]), float(point[1])])
        result.append({
            'level': level if level > 0 else 1,
            'street_geometry': street_geometry
        })
    return result


def switch_table(split_mode):
    if split_mode is None:
        return 'lines'
    elif split_mode == '500':
        return 'lines500'
    elif split_mode == '1000':
        return 'lines1000'
    else:
        return f'lines{split_mode}'


def get_street_table_pkname(table_name):
    if table_name == 'lines':
        return 'ogc_fid'
    elif table_name == 'lines500':
        return 'lines500_id'
    elif table_name == 'lines1000':
        return 'lines1000_id'
    else:
        return f'{table_name}_id'
