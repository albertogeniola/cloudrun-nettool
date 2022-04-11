"""
Flask entrypoint
"""
from flask import Flask, redirect, make_response as fmake_response
from flask_restful import Resource, Api

from net_tool_backend.api.v1.connection import TestTcpConnection
from net_tool_backend.api.v1.reponse import make_response
from net_tool_backend.api.v1.shell import Command
from net_tool_backend.api.v1.traceroute import Traceroute
from flask_cors import CORS


app = Flask(__name__, static_folder="../static", static_url_path="/")
api = Api(app)
CORS(app)

api.add_resource(Command, '/api/v1/shell/commands')
api.add_resource(TestTcpConnection, '/api/v1/network/test_connection/tcp/<string:host>/<int:port>')
api.add_resource(Traceroute, '/api/v1/network/traceroute/<string:host>')


# Route known paths to static angular controller
@app.route('/')
@app.route('/home')
@app.route('/connection')
@app.route('/traceroute')
def basic_pages(**kwargs):
    return fmake_response(open('static/index.html').read())


if __name__ == '__main__':
    app.run(debug=True)
