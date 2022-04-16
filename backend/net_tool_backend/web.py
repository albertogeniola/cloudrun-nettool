"""
Flask entrypoint
"""
import json
import logging
from flask import Flask, make_response as fmake_response
from flask_cors import CORS
from flask_restful import Api
from flask_sock import Sock

from net_tool_backend.api.v1.connection import TestTcpConnection
from net_tool_backend.api.v1.shell import Command
from net_tool_backend.api.v1.traceroute import Traceroute
from net_tool_backend.executor import CommandExecutor, CommandResult

app = Flask(__name__, static_folder="../static", static_url_path="/")
api = Api(app)
CORS(app)
sock = Sock(app)
app.config['SOCK_SERVER_OPTIONS'] = {'ping_interval': 25}


_LOGGER = logging.getLogger()


api.add_resource(Command, '/api/v1/shell/commands')
api.add_resource(TestTcpConnection, '/api/v1/network/test_connection/tcp/<string:host>/<int:port>')
api.add_resource(Traceroute, '/api/v1/network/traceroute/<string:host>')


# Route known paths to static angular controller
@app.route('/')
@app.route('/home')
@app.route('/connection')
@app.route('/traceroute')
@app.route('/terminal')
def basic_pages(**kwargs):
    return fmake_response(open('static/index.html').read())


@sock.route('/ws/terminal')
def terminal(ws):
    helomsg = None
    ws.send(json.dumps(helomsg))
    while True:
        try:
            data = ws.receive()
            # Parse the message as json
            message = json.loads(data)
            command = message.get("command")
            timeout = message.get("timeout", 300)
            merge_outputs = message.get("mergeOutputs", True)
            shell = message.get("useShell", True)
            executor = CommandExecutor(command_args=command, shell=shell, timeout=timeout, merge_stdout_stderr=merge_outputs)
            result = executor.execute()
            ws.send(json.dumps(result.serialize_data()))
        except Exception as e:
            _LOGGER.exception("Error occurred while executing websocket read-loop")
            ws.send(json.dumps({
                "retCode": None,
                "output": None,
                "err": None,
                "exception": str(e)
            }))


if __name__ == '__main__':
    app.run(debug=True)
