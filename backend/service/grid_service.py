import numpy as np
from sqlalchemy import text
from dao.engine import Session
from utils.get_level import get_level

lonperm = 0.00001141  # 经度方向每增加1m，经度增加的值
latperm = 0.00000899  # 纬度方向每增加1m，纬度增加的值


def grid_service(grid, timespan):
    rectWidth = float(grid['width'])  # 网格宽度，单位：米
    rectHeight = float(grid['height'])  # 网格高度，单位：米
    fromPoint = grid['from']  # 起点经纬度，如[125.10861111111112, 43.7325]
    toPoint = grid['to']  # 终点经纬度，如[125.57722222222222, 44.00277777777778]

    # 查询指定时间段内的出租车数据
    session = Session()
    sql_query = text("SELECT speed, lon, lat FROM all_data WHERE time BETWEEN :start_time AND :end_time")
    query = session.execute(
        sql_query,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()

    # 计算网格数量
    speed = np.zeros(len(make_number_map(fromPoint[0], fromPoint[1], toPoint[0], toPoint[1], rectWidth, rectHeight)))
    taxi_count = np.zeros(len(speed))

    # 制作网格编号和经纬度范围的映射
    position_map = make_number_map(fromPoint[0], fromPoint[1], toPoint[0], toPoint[1], rectWidth, rectHeight)

    err_position = []

    # 计算每个网格的平均速度
    for row in query:
        if row.speed == 0:
            continue
        grid_number = cacl_grid_number(position_map, row.lon, row.lat)
        if grid_number == -1:
            err_position.append([row.lon, row.lat])
            continue
        speed[grid_number] += row.speed
        taxi_count[grid_number] += 1

    # Avoid division by zero
    taxi_count[taxi_count == 0] = 1

    # 计算每个网格的平均速度
    speed /= taxi_count

    # 计算拥堵指数
    result = []
    for i in range(len(position_map)):
        level = get_level(speed[i])
        result.append(
            {
                "grid_geometry": list(position_map[i]),
                "level": int(level)
            }
        )
    return result


def make_number_map(startlon, startlat, endlon, endlat, rectWidth, rectHeight):
    # 返回一个数组，下标是网格编号，值是网格的经纬度范围
    lats = np.arange(startlat, endlat, rectHeight * latperm)
    lons = np.arange(startlon, endlon, rectWidth * lonperm)

    lon_grid, lat_grid = np.meshgrid(lons, lats)

    position = np.dstack((lon_grid, lat_grid, lon_grid + rectWidth * lonperm, lat_grid + rectHeight * latperm))

    return position.reshape(-1, 4)


def cacl_grid_number(position_map, lon, lat):
    # 根据经纬度计算网格编号
    indices = np.where((position_map[:, 0] <= lon) & (lon < position_map[:, 2]) &
                       (position_map[:, 1] <= lat) & (lat < position_map[:, 3]))

    return indices[0][0] if indices[0].size > 0 else -1
