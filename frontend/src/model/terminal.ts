export interface TerminalCommand {
  command: string;
  timeout: number;
  mergeOutputs: boolean;
  useShell: boolean;
}

export interface TerminalResponse {
  retCode: number | null;
  output: string | null;
  err: string | null;
  exception: string | null;
}
