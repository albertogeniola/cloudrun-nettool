from typing import List

from flask_restful import reqparse, abort, Api, Resource

from net_tool_backend.api.v1.reponse import make_success_response
from net_tool_backend.executor import CommandExecutor


parser = reqparse.RequestParser()
parser.add_argument('args', type=str, action="append", help="Command to execute as list of string (['/bin/ls', '-l']).")


class Command(Resource):
    def post(self):
        args = parser.parse_args()
        ex = CommandExecutor(command_args=args.args)
        res = ex.execute()
        return make_success_response(res.serialize_data())
