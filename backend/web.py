"""
Flask entrypoint
"""
from flask import Flask
from flask_restful import Resource, Api

from api.v1.connection import TestTcpConnection
from api.v1.shell import Command
from api.v1.traceroute import Traceroute
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
CORS(app)

api.add_resource(Command, '/api/v1/shell/commands')
api.add_resource(TestTcpConnection, '/api/v1/network/test_connection/tcp/<string:host>/<int:port>')
api.add_resource(Traceroute, '/api/v1/network/traceroute/<string:host>')

if __name__ == '__main__':
    app.run(debug=True)