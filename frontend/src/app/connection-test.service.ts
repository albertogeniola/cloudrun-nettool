import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Protocol } from 'src/model/protocol';
import { IpAddress } from 'src/model/address';
import { ApiResponse } from 'src/model/api';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';


const options = {
  headers: {"content-type":"application/json"}
};

export class TestConnectionConfiguration {
  public host: String;
  public protocol: Protocol;
  public port:Number;
  public readData: boolean = false;
  public timeout: Number = 10.0;

  constructor(host: String, protocol: Protocol, port: Number) {
      this.host = host;
      this.protocol = protocol;
      this.port = port;
  }
}


export interface ConnectionResult {
  connectionSuccess: boolean;
  connectionError: String;
  readError:String;
  rttMs: Number;
  readData: any;
  remotePeerAddr: [string, number];
  localAddr: [string, number];
}


@Injectable({
  providedIn: 'root'
})
export class ConnectionTestService {

  constructor(private http: HttpClient) { }

  executeConnectionTest(conf: TestConnectionConfiguration): Observable<ConnectionResult> {
    return this.http.post<ApiResponse<ConnectionResult>>(
      environment.BASE_URL + "/api/v1/network/test_connection/"+conf.protocol+"/"+conf.host+"/"+conf.port,
      {"timeout": conf.timeout, "readData": conf.readData},
      options
    )
    .pipe(
      catchError(this.handleError<ApiResponse<ConnectionResult>>('executeConnectionTest')),
      map(res => res.data as ConnectionResult )
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
      }
      // Return an observable with a user-facing error message.
      return throwError(() => new Error('An error occurred.'));
    };
  }
}
