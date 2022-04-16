import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../environments/environment";
import { Observer } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TerminalResponse, TerminalCommand } from 'src/model/terminal';



@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true })
  private child!: NgTerminal;
  private terminalSubject: WebSocketSubject<any> ;
  private intervalId!: ReturnType<typeof setTimeout>;

  public buffer: string;
  public connected:boolean;
  public busy: boolean;
  public timeout: number;
  public elapsed: number;
  public timedOut: boolean;
  public mergeOutputs: boolean;
  public useShell: boolean;

  constructor(private snackbar:MatSnackBar) {
    this.buffer = "";
    this.connected = false;
    this.busy = false;
    this.timeout = 30;
    this.elapsed = 0;
    this.timedOut = false;
    this.mergeOutputs = false;
    this.useShell = true;

    // If an absolute path has been specified in the terminal_ws env var, use that.
    // Otherwise, calculate it starting from the current location
    let terminalWsAddress = this.calculateTerminalAddress()

    this.terminalSubject = webSocket(terminalWsAddress);
  }

  ngOnInit(): void {
    this.connect();
  }

  ngAfterViewInit() {

  }

  private observer: Observer<any> = {
    next: (msg:any) => {
      console.debug("Received message: ", msg);
      if (this.connected) {
        this.handleServerMessage(msg as TerminalResponse)
      } else if (msg == null) {
        this.connected = true;
      }
    },
    error: (err:any) => {
      console.error("Error: ", err);
      this.connected = false;
      this.snackbar.open("Connection lost.", "ok");
    },
    complete: () => {
      this.connected = false;
    }
  }

  private connect() {
    this.terminalSubject.asObservable().subscribe(this.observer);
  }

  private calculateTerminalAddress(): string {
    // If a full path was specified, use that.
    if (environment.TERMINAL_WS.startsWith("ws://") || environment.TERMINAL_WS.startsWith("wss://"))
      return environment.TERMINAL_WS;
    else {
      // Otherwise, infer it from the current location
      let protocol = window.location.protocol.toLowerCase() == "https" ? "wss" : "ws";
      return protocol + "://" + window.location.hostname + ":" + window.location.port + environment.TERMINAL_WS
    }
  }

  private handleServerMessage(message: TerminalResponse) {
    console.info("SERVER RESPONSE: ", message);
    let output!: string;
    let error!: string;

    if (message.output) {
      output = atob(message.output);
      this.child.write(output);
    }
    if (message.err) {
      error = atob(message.err);
      this.child.write(error);
    }

    if (message.exception) {
      this.snackbar.open(message.exception, "ok");
    }

    // Only reset the buffer if the return code was 0
    if (message.retCode==0) {
      this.buffer = "";
    }

    // In any case, make the command line available again
    this.busy = false;

    this.resetCommandTimer(false);
  }

  public sendMessage(): void {
    let terminalCommand = {
      command: this.buffer,
      timeout: Number(this.timeout),
      mergeOutputs: this.mergeOutputs,
      useShell: this.useShell
    } as TerminalCommand;

    this.child.write("\n(CLIENT COMMAND): "+this.buffer+"\n");
    this.elapsed = 0;
    this.terminalSubject.next(terminalCommand);
    this.startCommandTimer();
    this.busy = true;
  }

  private startCommandTimer() {
    this.intervalId = setInterval(() => {
      this.elapsed = this.elapsed + 1;
    }, 1000);
  }

  private resetCommandTimer(timedOut:boolean) {
    clearInterval(this.intervalId);
    this.timedOut = timedOut;
  }

  public keyPressed(evt:KeyboardEvent) {
    if (evt.key == 'Enter') {
      this.sendMessage();
    }
  }
}
