from flask_restful import Resource

from net_tool_backend.api.v1.reponse import make_success_response
from net_tool_backend.network_tools.traceroute import Tracer


class Traceroute(Resource):
    def post(self, host:str):
        trace = Tracer(target_host=host)
        trace_res = trace.run()
        return make_success_response(data=trace_res.serialize_data())

