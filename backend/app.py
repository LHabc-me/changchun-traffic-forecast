from flask import Flask
from controller.grid_controller import grid
from controller.position_controller import position
from controller.street_controller import street
from controller.data_timespan_controller import data_timespan
from controller.charts_option_controller import charts_option
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(grid)
app.register_blueprint(position)
app.register_blueprint(street)
app.register_blueprint(data_timespan)
app.register_blueprint(charts_option)

if __name__ == '__main__':
    app.run(port=8000)
