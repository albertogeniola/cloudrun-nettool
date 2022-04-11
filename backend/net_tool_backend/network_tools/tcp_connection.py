"""
Command executor module
"""
import socket
import time
from typing import Any, Dict, List, Tuple


class ConnectionResult():
    # Class attributes (for quicker init)
    connection_success:bool = False
    connection_error:str = None
    read_error:str = None
    rtt_ms: float = -1.0
    read_data: bytes = None
    remote_peer_addr: Tuple[str, int] = None
    local_addr: Tuple[str, int] = None

    def serialize_data(self) -> Dict:
        return {
            "connectionSuccess": self.connection_success,
            "connectionError": self.connection_error,
            "readError": self.read_error,
            "rttMs": self.rtt_ms,
            "readData": self.read_data,
            "remotePeerAddr": self.remote_peer_addr,
            "localAddr": self.local_addr
        }


class SocketConnector:
    """
    Implements tcp-socket connection
    """
    def __init__(self,
                 target_host:str,
                 target_port:int,
                 read_bytes:bool=False,
                 read_bufsize:int=4096,
                 timeout=5.0):
        self.host=target_host
        self.port=target_port
        self.read_bytes = read_bytes
        self.read_bufsize = read_bufsize
        self.timeout = timeout

    def connect(self) -> ConnectionResult:
        """
        Attempts a TCP connection against the given IP:PORT, waits a bit to read some bytes and the closes
        the connection.
        :return: A connection result object.
        """
        res = ConnectionResult()

        # Test socket connection
        s = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
        s.settimeout(self.timeout)

        starttime = time.time_ns()
        elapsed = -1
        try:
            # Connect to the socket
            s.connect((self.host, self.port))
            endtime = time.time_ns()
            elapsed = (endtime - starttime)/1000/1000
            res.connection_success = True
            res.rtt_ms = elapsed
            res.remote_peer_addr = s.getpeername()
            res.local_addr = s.getsockname()
        except Exception as e:
            # In case of exception when connecting, return immediately
            res.connection_success = False
            res.connection_error = str(e)
            return res

        # Test data reading
        if self.read_bytes:
            try:
                data = s.recv(self.read_bufsize)
                res.read_data = data
            except TimeoutError as e:
                res.read_error = str(e)
            except OSError as e:
                res.read_error = str(e)

        # Close the socket
        try:
            s.close()
        except Exception as e:
            # We don't care about errors when closing the socket
            pass

        return res