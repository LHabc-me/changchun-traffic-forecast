from flask import Flask, jsonify, request
from controller.congestion_level_controller import congestion_level
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(congestion_level)

if __name__ == '__main__':
    app.run(port=8000)
