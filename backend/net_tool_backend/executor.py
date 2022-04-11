"""
Command executor module
"""
import os
from subprocess import Popen, STDOUT, PIPE, TimeoutExpired
from typing import List, Tuple, Any
import base64


class CommandResult():
    ret_code:int = None
    output:bytes|str = None
    err: bytes|str = None

    def serialize_data(self) -> Any:
        return {
            "retCode": self.ret_code,
            "output": self.output,
            "err": self.err
        }


class CommandExecutor:
    """
    Base command executor helper.
    Takes care of running a command on this instance and returns the output
    """
    def __init__(self, command_args:List[str], shell:bool=True, timeout:float=30.0, merge_stdout_stderr:bool=True, decode_output:bool=True, **kwargs):
        self.command_args = command_args
        self.shell = shell
        self.timeout = timeout
        self.merge_stdout_stderr=merge_stdout_stderr
        self.decode_output = decode_output

    def execute(self) -> CommandResult:
        res = CommandResult()
        # Create the process and start running it
        p = Popen(args=self.command_args,
                  stderr=STDOUT if self.merge_stdout_stderr else PIPE,
                  stdout=PIPE,
                  shell=self.shell)

        # Wait for the process to exit and return its status
        try:
            p.wait(timeout=self.timeout)
        except TimeoutExpired as e:
            res.err = str(e)
            return res

        # Collect the data into base64 encoded output and return it together with return code
        out = p.stdout.read() if p.stdout is not None else None
        err = None if (not self.merge_stdout_stderr or p.stderr is None) else p.stderr.read()

        if self.decode_output:
            # Try to decode the output based on the shell encoding
            encoding = os.environ.get("LC_CTYPE", "utf8")
            out = out.decode(encoding=encoding)
            if not self.merge_stdout_stderr:
                err =  err.decode(encoding=encoding)

        res.output = out
        res.err = err
        res.ret_code = p.returncode

        return res
