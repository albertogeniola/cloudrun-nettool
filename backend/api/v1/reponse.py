import json
from typing import Any, Dict
from flask import Response


def make_response(success: bool, error: str|None, data: Any|None, http_code:int) -> Response:
    data = {
        "success": success,
        "error": error,
        "data": data
    }
    return Response(response=json.dumps(data), status=http_code, content_type="application/json")


def make_success_response(data: Any, http_code:int=200)  -> Response:
    return make_response(success=True, error=None, data=data, http_code=http_code)


def make_failure_response(error:str, data:Any=None, http_code:int=400)  -> Response:
    return make_response(success=False, error=error, data=data, http_code=http_code)
