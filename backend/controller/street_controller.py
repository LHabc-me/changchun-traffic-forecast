import json
from flask import Response, request, jsonify, Blueprint
from service.street_service import street_service

street = Blueprint('street', __name__)


@street.route('/api/street', methods=['POST'])
def position_controller():
    data = request.get_json()
    timespan = data['timespan']
    response = street_service(timespan)
    return Response(json.dumps(response), status=200, mimetype='application/json')
