import json
from flask import Response, request, jsonify, Blueprint
from service.charts_option_service import charts_option_service

charts_option = Blueprint('charts_option', __name__)


@charts_option.route('/api/charts', methods=['POST'])
def position_controller():
    data = request.get_json()
    timespan = data['timespan']
    chartsType = data['type']
    response = charts_option_service(timespan, chartsType)
    response = {
        "type": "charts_option",
        "data": response
    }
    return Response(json.dumps(response), status=200, mimetype='application/json')
