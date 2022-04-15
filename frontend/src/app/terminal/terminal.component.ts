import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../environments/environment";
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';


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
  private buffer: string;
  private terminalSubject: any ;
  private subscribed:boolean;

  constructor() {
    this.buffer = "";
    this.subscribed = false;

    // If an absolute path has been specified in the terminal_ws env var, use that.
    // Otherwise, calculate it starting from the current location
    let terminalWsAddress = this.calculateTerminalAddress()

    this.terminalSubject = webSocket(environment.TERMINAL_WS);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.child.keyEventInput.subscribe(e => {
      console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        this.child.write('\n' + FunctionsUsingCSI.cursorColumn(1) + '$ '); // \r\n
        // Send the command
        this.sendMessage(this.buffer);
        // Reset the local command buffer
        this.buffer="";
      } else if (ev.keyCode === 8) {
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
          this.buffer = this.buffer.slice(0, -1)
        }
      } else if (printable) {
        this.child.write(e.key);
        this.buffer += e.key
      }

      console.log('buffer: ' + this.buffer);

    })
  }

  private calculateTerminalAddress(): string {
    if (environment.TERMINAL_WS.startsWith("ws://") || environment.TERMINAL_WS.startsWith("wss://"))
      return environment.TERMINAL_WS;
    else
      return "ws://"+window.location.href+environment.TERMINAL_WS
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
  }

  private sendMessage(command: string): void {
    if (!this.subscribed) {
      this.terminalSubject.subscribe((msg: TerminalResponse)=> {
        this.handleServerMessage(msg);
      });
      this.subscribed = true;
    }

    this.terminalSubject.next({command: command});
  }
}
