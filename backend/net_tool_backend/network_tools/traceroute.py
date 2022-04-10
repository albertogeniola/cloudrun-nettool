"""
Command executor module
"""
import socket
import struct
import time
from typing import Any, Dict, List, Tuple


class TraceResult():
    trace_succeeded: bool = False
    trace_error: str = None
    hops: List[Dict] = None

    def __init__(self):
        self.hops = []

    # # Class attributes (for quicker init)
    # connection_success:bool = False
    # connection_error:str = None
    # read_error:str = None
    # rtt_ms: float = -1.0
    # read_data: bytes = None
    # remote_peer_addr: Tuple[str, int] = None
    # local_addr: Tuple[str, int] = None
    #
    def serialize_data(self) -> Dict:
        return {
            "traceSucceeded": self.trace_succeeded,
            "traceError": self.trace_error,
            "hops": self.hops
        }


class Tracer:
    """
    Implements traceroute at python level
    """
    def __init__(self,
                 target_host:str,
                 max_hops:int=30):
        self.target_host=target_host
        self.max_hops = max_hops

    def run(self) -> TraceResult:
        """
        Performs the traceroute against the given endpoint
        :return: A connection result object.
        """
        res = TraceResult()

        # Resolve the target destination
        dest_addr = None
        try:
            dest_addr = socket.gethostbyname(self.target_host)
        except Exception as e:
            res.trace_succeeded = False
            res.trace_error = str(e)
            return res

        port = 33434
        max_hops = 30
        icmp = socket.getprotobyname('icmp')
        udp = socket.getprotobyname('udp')
        ttl = 1

        while True:
            recv_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, icmp)
            send_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, udp)
            send_socket.setsockopt(socket.SOL_IP, socket.IP_TTL, ttl)

            # Build the GNU timeval struct (seconds, microseconds)
            timeout = struct.pack("ll", 5, 0)

            # Set the receive timeout so we behave more like regular traceroute
            recv_socket.setsockopt(socket.SOL_SOCKET, socket.SO_RCVTIMEO, timeout)

            recv_socket.bind(("", port))
            line = {
                "ttl": ttl,
                "tries": 0,
                "host": None
            }
            #res.hops.append([ttl])
            send_socket.sendto("", (self.target_host, port))
            curr_addr = None
            curr_name = None
            finished = False
            tries = 3
            while not finished and tries > 0:
                try:
                    _, curr_addr = recv_socket.recvfrom(512)
                    finished = True
                    curr_addr = curr_addr[0]
                    try:
                        curr_name = socket.gethostbyaddr(curr_addr)[0]
                    except socket.error:
                        curr_name = curr_addr
                except socket.error as err:
                    tries = tries - 1
                    line["tries"] += 1

            send_socket.close()
            recv_socket.close()

            if not finished:
                pass

            if curr_addr is not None:
                curr_host = "%s (%s)" % (curr_name, curr_addr)
            else:
                curr_host = ""
            line["host"] = curr_host

            ttl += 1
            if curr_addr == dest_addr or ttl > max_hops:
                break
            res.hops.append(line)

        return res