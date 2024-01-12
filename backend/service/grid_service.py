import math
import numpy as np
from sqlalchemy import text

from service.engine import Session

lonperm = 0.00001141  # 经度方向每增加1m，经度增加的值
latperm = 0.00000899  # 纬度方向每增加1m，纬度增加的值


def grid_service(grid, timespan):
    """
    :param grid: 网格信息
    :param timespan: 时间段
    :return: 拥堵指数
    """
    rectWidth = float(grid['width'])  # 网格宽度，单位：米
    rectHeight = float(grid['height'])  # 网格高度，单位：米
    fromPoint = grid['from']  # 起点经纬度，如[125.10861111111112, 43.7325]
    toPoint = grid['to']  # 终点经纬度，如[125.57722222222222, 44.00277777777778]

    # 查询指定时间段内的出租车数据
    session = Session()
    sql_query = text("SELECT * FROM all_data WHERE time BETWEEN :start_time AND :end_time")
    query = session.execute(
        sql_query,
        {
            'start_time': timespan['from'],
            'end_time': timespan['to']
        }
    ).fetchall()
    session.close()

    # 计算网格数量
    speed = {}
    taxi_count = {}
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
        speed[grid_number] = speed.get(grid_number, 0) + row.speed
        taxi_count[grid_number] = taxi_count.get(grid_number, 0) + 1

    result = []

    # 计算拥堵指数
    for key in speed:
        speed[key] = speed[key] / taxi_count[key]
    for i in range(len(position_map)):
        level = math.ceil(speed.get(i, 0) / 10) + 1
        if level > 10:
            level = 10
        result.append([position_map[i][0],
                       position_map[i][1],
                       position_map[i][2],
                       position_map[i][3],
                       level])

    return result


def make_number_map(startlon, startlat, endlon, endlat, rectWidth, rectHeight):
    # 返回一个数组，下标是网格编号，值是网格的经纬度范围
    position = []
    for lat in np.arange(startlat, endlat, rectHeight * latperm):
        for lon in np.arange(startlon, endlon, rectWidth * lonperm):
            position.append([lon, lat, lon + rectWidth * lonperm, lat + rectHeight * latperm])
    return position


def cacl_grid_number(position_map, lon, lat):
    # 根据经纬度计算网格编号
    grid_number = -1
    for i in range(len(position_map)):
        if position_map[i][0] <= lon < position_map[i][2] and position_map[i][1] <= lat < position_map[i][3]:
            grid_number = i
            break
    # assert grid_number != -1, (f"网格编号计算错误，"
    #                            f"lon={lon}, "
    #                            f"lat={lat}, "
    #                            f"grid_number={grid_number}"
    #                            f"position_map={position_map}")
    return grid_number
