import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../environments/environment";
import { Observer } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


interface TerminalResponse {
  retCode: number
  output: string
  err: string
}


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

  private observer: Observer<any> = {
    next: (msg:any) => {
      console.info("Received message: ", msg);
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

  constructor(private snackbar:MatSnackBar) {
    this.buffer = "";
    this.connected = false;
    this.busy = false;
    this.timeout = 30;
    this.elapsed = 0;
    this.timedOut = false;

    // If an absolute path has been specified in the terminal_ws env var, use that.
    // Otherwise, calculate it starting from the current location
    let terminalWsAddress = this.calculateTerminalAddress()

    this.terminalSubject = webSocket(terminalWsAddress);
  }

  ngOnInit(): void {
    this.connect();
  }

  ngAfterViewInit(){}

  private connect() {
    this.terminalSubject.asObservable().subscribe(this.observer);
  }

  private calculateTerminalAddress(): string {
    if (environment.TERMINAL_WS.startsWith("ws://") || environment.TERMINAL_WS.startsWith("wss://"))
      return environment.TERMINAL_WS;
    else
      return "ws://" + window.location.href+environment.TERMINAL_WS
  }

  private handleServerMessage(message: TerminalResponse) {
    console.info("SERVER RESPONSE: ", message);
    let output!: string;
    let error!: string;

    if (message.output)
      output = atob(message.output);
    if (message.err)
      error = atob(message.err);

    this.child.write(output);

    // Only reset the buffer if the return code was 0
    if (message.retCode==0) {
      this.buffer = "";
    }

    // In any case, make the command line available again
    this.busy = false;

    this.resetCommandTimer(false);
  }

  public sendMessage(command: string): void {
    this.child.write("\n(CLIENT COMMAND): "+this.buffer+"\n");
    this.elapsed = 0;
    this.terminalSubject.next({command: command});
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
      this.sendMessage(this.buffer);
    }
  }
}
