import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketTestComponent } from './socket-test/socket-test.component';
import {SocketTestRoutingModule} from './socket-test-routing.module';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [SocketTestComponent],
  imports: [
    CommonModule,
    SocketTestRoutingModule,
    NgbAlertModule,
    NgbNavModule
  ]
})
export class SocketTestModule { }
