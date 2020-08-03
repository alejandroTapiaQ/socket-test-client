import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketTestComponent } from './socket-test/socket-test.component';
import {SocketTestRoutingModule} from './socket-test-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [SocketTestComponent],
  imports: [
    CommonModule,
    SocketTestRoutingModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class SocketTestModule { }
