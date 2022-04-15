import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionTestComponent } from './connection-test/connection-test.component';
import { HomeComponent } from './home/home.component';
import { TerminalComponent } from './terminal/terminal.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'connection', component: ConnectionTestComponent, data: { title: 'Connection' } },
  { path: 'traceroute', component: HomeComponent, data: { title: 'Traceroute' } },
  { path: 'terminal', component: TerminalComponent, data: { title: 'Terminal' } },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
