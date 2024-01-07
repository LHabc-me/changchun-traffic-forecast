from flask import Flask
from controller.congestion_level_controller import congestion_level
from controller.position_controller import position
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(congestion_level)
app.register_blueprint(position)

if __name__ == '__main__':
    app.run(port=8000)
