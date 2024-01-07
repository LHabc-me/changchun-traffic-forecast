import math
import numpy as np
from sqlalchemy import text

from service.engine import Session

lonperm = 0.00001141  # 经度方向每增加1m，经度增加的值
latperm = 0.00000899  # 纬度方向每增加1m，纬度增加的值


def congestion_level_service(grid, timespan):
    """
    :param grid: 网格信息
    :param timespan: 时间段
    :return: 拥堵指数
    """
    """
    网格编号先沿东方向编号，再沿北方向编号，如下图所示：
    789
    456
    123
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
    # result = []

    speed = {}
    taxi_count = {}
    position = {}

    for lat in np.arange(fromPoint[1], toPoint[1], rectHeight * latperm):
        for lon in np.arange(fromPoint[0], toPoint[0], rectWidth * lonperm):
            grid_number = cacl_grid_number(float(lon) + lonperm * rectWidth / 2,
                                           float(lat) + latperm * rectHeight / 2,
                                           fromPoint, toPoint, rectWidth, rectHeight)
            position[grid_number] \
                = [lon, lat, lon + rectWidth * lonperm, lat + rectHeight * latperm]

    for row in query:
        if row.speed == 0:
            continue
        grid_number = cacl_grid_number(float(row.lon) + lonperm * rectWidth / 2,
                                       float(row.lat) + latperm * rectHeight / 2,
                                       fromPoint, toPoint,
                                       rectWidth, rectHeight)
        speed[grid_number] = speed.get(grid_number, 0) + row.speed
        taxi_count[grid_number] = taxi_count.get(grid_number, 0) + 1

    result = []
    for key in speed:
        speed[key] = speed[key] / taxi_count[key]
    for i in range(1, cacl_grid_number(toPoint[0] + lonperm * rectWidth / 2,
                                       toPoint[1] + latperm * rectHeight / 2,
                                       fromPoint, toPoint, rectWidth, rectHeight)):
        if position.get(i) is None:
            continue
        result.append([position[i][0],
                       position[i][1],
                       position[i][2],
                       position[i][3],
                       math.ceil(speed.get(i, 0) / 10) + 1])

    return result


def cacl_grid_number(lon, lat, fromPoint, toPoint, rectWidth, rectHeight):
    """
    计算所在网格编号
    :param lon: 经度
    :param lat: 纬度
    :param fromPoint: 起点经纬度
    :param toPoint: 终点经纬度
    :param rectWidth: 网格宽度
    :param rectHeight: 网格高度
    :return: 网格编号
    """
    # 计算经度方向网格数量
    lonGridCnt = math.ceil((toPoint[0] - fromPoint[0]) / (rectWidth * lonperm))
    # 计算纬度方向网格数量
    latGridCnt = math.ceil((toPoint[1] - fromPoint[1]) / (rectHeight * latperm))

    # 计算所在网格编号
    lonGridNumber = math.ceil((lon - fromPoint[0]) / (rectWidth * lonperm))
    latGridNumber = math.ceil((lat - fromPoint[1]) / (rectHeight * latperm))

    num = (latGridNumber - 1) * lonGridCnt + lonGridNumber
    assert num > 0, (lon, lat, fromPoint, toPoint, rectWidth, rectHeight)
    return num
