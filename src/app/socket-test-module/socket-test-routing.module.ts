import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SocketTestComponent} from './socket-test/socket-test.component';

const routes: Routes = [
  { path: '', component: SocketTestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocketTestRoutingModule { }
