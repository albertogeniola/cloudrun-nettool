"""
Command executor module
"""
import os
from subprocess import Popen, STDOUT, PIPE, TimeoutExpired
from typing import List, Tuple, Any
import base64


class CommandResult:
    ret_code: int = None
    output: bytes | str = None
    err: bytes | str = None

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

    def __init__(self, command_args: List[str] | str, shell: bool = True, timeout: float = 300.0,
                 merge_stdout_stderr: bool = True, **kwargs):
        self.command_args = command_args
        self.shell = shell
        self.timeout = timeout
        self.merge_stdout_stderr = merge_stdout_stderr

    def execute(self) -> CommandResult:
        res = CommandResult()
        # Create the process and start running it
        p = Popen(args=self.command_args,
                  stderr=STDOUT if self.merge_stdout_stderr else PIPE,
                  stdout=PIPE,
                  shell=self.shell)

        # Wait for the process to exit and return its status
        p.wait(timeout=self.timeout)

        # Collect the data into base64 encoded output and return it together with return code
        out = None
        err = None
        if p.stdout is not None:
            out = p.stdout.read()
            out = base64.b64encode(out).decode("ascii")
        if p.stderr is not None and p.stderr is not None and not self.merge_stdout_stderr:
            err = p.stderr.read()
            err = base64.b64encode(err).decode("ascii")

        res.output = out
        res.err = err
        res.ret_code = p.returncode

        return res
