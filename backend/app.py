from flask import Flask, jsonify, request
from api.congestion_level import congestion_level

app = Flask(__name__)
app.register_blueprint(congestion_level)

if __name__ == '__main__':
    app.run(port=8000)
