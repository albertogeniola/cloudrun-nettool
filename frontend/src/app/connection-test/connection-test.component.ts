import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Protocol } from 'src/model/protocol';
import { ConnectionResult, ConnectionTestService, TestConnectionConfiguration } from '../connection-test.service';


class ConnectionTest {
  public configuration:TestConnectionConfiguration;
  public result:ConnectionResult;

  constructor(configuration: TestConnectionConfiguration, result:ConnectionResult) {
    this.configuration = configuration;
    this.result = result;
  }
}


@Component({
  selector: 'app-connection-test',
  templateUrl: './connection-test.component.html',
  styleUrls: ['./connection-test.component.css']
})
export class ConnectionTestComponent implements OnInit {
  public loading: boolean = false;
  public executions: ConnectionTest[] = [];
  public conf:TestConnectionConfiguration = new TestConnectionConfiguration("", Protocol.TCP, 80);
  public connectionTestForm: FormGroup = new FormGroup({
    host: new FormControl(this.conf.host, [Validators.required]),
    protocol: new FormControl(this.conf.protocol, [Validators.required]),
    port: new FormControl(this.conf.port, [Validators.required, Validators.min(1), Validators.max(65535)]),
    timeout: new FormControl(this.conf.timeout, [Validators.required, Validators.min(0), Validators.max(300)]),
    readData: new FormControl(this.conf.readData, []),
  });

  constructor(private connectionService: ConnectionTestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  runTest(): void {
    this.loading = true;
    this.connectionService.executeConnectionTest(this.conf).subscribe(res => {
      console.log(res);
      let execution = new ConnectionTest(Object.assign({}, this.conf), res);
      this.executions.splice(0,0,execution);
      this.loading = false;
    },err=> {
      this.snackBar.open("Test failed. "+err,"OK");
      this.loading = false;
    });
  }
}
