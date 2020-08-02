import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketTestComponent } from './socket-test/socket-test.component';
import {SocketTestRoutingModule} from './socket-test-routing.module';



@NgModule({
  declarations: [SocketTestComponent],
  imports: [
    CommonModule,
    SocketTestRoutingModule
  ]
})
export class SocketTestModule { }
