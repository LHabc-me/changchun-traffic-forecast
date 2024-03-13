import json
from flask import Response, request, jsonify, Blueprint
from service.street_service import street_service

street = Blueprint('street', __name__)


@street.route('/api/street', methods=['POST'])
def position_controller():
    data = request.get_json()
    timespan = data['timespan']
    split_mode = data['split']['mode']
    response = street_service(timespan, split_mode)
    response = {
        "type": "street",
        "data": response
    }
    return Response(json.dumps(response), status=200, mimetype='application/json')
