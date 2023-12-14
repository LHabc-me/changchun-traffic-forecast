from flask import Flask, request, jsonify, Blueprint

congestion_level = Blueprint('congestion_level', __name__)

"""
    request:
    {
        "grid": {
            "width": 10, // 网络宽度
            "height": 10, // 网络高度
            "start": [0, 0], // 终点经纬度
            "end": [9, 9], // 终点经纬度
        },
        "times": [ // 时间段
           "2019-01-01 00:00:00", // 起始时间
           "2019-02-01 00:00:00", // 结束时间
        ]
    }

    response:
    {
        "status": 200,
        "message": "success",
        "data": [ //从低经度到高经度，从低纬度到高纬度，每个栅格的拥堵指数
            1,
            1.2,
            0.2
            ....
        ]
    }
"""


@congestion_level.route('/congestion_level', methods=['POST'])
def congestion_level():
    data = request.get_json()  # 获取请求体中的 JSON 数据
    grid = data['grid']
    times = data['times']
    print(data)
    return jsonify({
        "status": 200,
        "message": "success",
        "data": [1, 1.2, 0.2]
    })
