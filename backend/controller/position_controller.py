import json
from flask import Response, request, jsonify, Blueprint
from service.position_service import position_service

position = Blueprint('position', __name__)


@position.route('/api/position', methods=['POST'])
def position_controller():
    data = request.get_json()
    timespan = data['timespan']
    response = position_service(timespan)
    return Response(json.dumps(response), status=200, mimetype='application/json')
