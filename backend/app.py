from flask import Flask
from controller import grid, position, street, data_timespan, charts_option
from flask_cors import CORS
from gevent import pywsgi

from env import load_env

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(grid)
app.register_blueprint(position)
app.register_blueprint(street)
app.register_blueprint(data_timespan)
app.register_blueprint(charts_option)

if __name__ == '__main__':
    # 读取../env.json文件中的配置
    env = load_env()
    port = env["backend"]["port"]
    if env["mode"] == 'debug':
        app.run(port=port, debug=True)
    elif env["mode"] == 'release':
        server = pywsgi.WSGIServer(('0.0.0.0', port), app)
        server.serve_forever()
