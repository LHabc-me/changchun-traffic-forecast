import json
from flask import Response, request, jsonify, Blueprint
from service.data_timespan_service import data_timespan_service

data_timespan = Blueprint('data_timespan', __name__)


@data_timespan.route('/api/data_timespan', methods=['POST'])
def position_controller():
    response = data_timespan_service()
    response = {
        "type": "data_timespan",
        "data": response
    }
    return Response(json.dumps(response), status=200, mimetype='application/json')
