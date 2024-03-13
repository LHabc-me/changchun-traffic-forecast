import json
from flask import Response, request, jsonify, Blueprint
from service.grid_service import grid_service

grid = Blueprint('grid', __name__)


@grid.route('/api/grid', methods=['POST'])
def congestion_level_controller():
    """
        request:
        {
            "grid": {
                "width": 10, // 网络宽度 单位：米
                "height": 10, // 网络高度 单位：米
                "from": [0, 0], // 起点经纬度
                "to": [9, 9], // 终点经纬度
            },
            "timespan": { // 时间段
               "from": "2019-01-01 00:00:00", // 起始时间
               "to": "2019-02-01 00:00:00", // 结束时间
            }
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
    data = request.get_json()
    grid = data['grid']
    timespan = data['timespan']
    response = grid_service(grid, timespan)
    response = {
        "type": "grid",
        "data": response
    }
    return Response(json.dumps(response), status=200, mimetype='application/json')
