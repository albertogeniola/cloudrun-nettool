from flask_restful import Resource, reqparse


from api.v1.reponse import make_success_response
from network_tools.tcp_connection import SocketConnector



class TestTcpConnection(Resource):
    def __init__(self):
        self.tcpConnectionParser = reqparse.RequestParser()
        self.tcpConnectionParser.add_argument('timeout', type=float, help='Timeout', required=False, default=10.0)
        self.tcpConnectionParser.add_argument('readData', type=bool, required=False, default=False)

    def post(self, host:str, port:int):
        args = self.tcpConnectionParser.parse_args()

        conn = SocketConnector(target_host=host, target_port=port, read_bytes=args.get("readData"), timeout=args.get("timeout"))
        conn_res = conn.connect()
        return make_success_response(data=conn_res.serialize_data())

