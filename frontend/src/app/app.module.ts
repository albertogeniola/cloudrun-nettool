import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ConnectionTestComponent } from './connection-test/connection-test.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConnectionTestService } from './connection-test.service';
import { HttpClientModule } from '@angular/common/http';
import { NgTerminalModule } from 'ng-terminal';
import { TerminalComponent } from './terminal/terminal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConnectionTestComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgTerminalModule
  ],
  providers: [ConnectionTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
