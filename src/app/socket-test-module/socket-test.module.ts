import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalViewComponent } from './princial-view/principal-view.component';
import {SocketTestRoutingModule} from './socket-test-routing.module';
import {NgbAlertModule, NgbNavModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {SocketTestService} from './socket-test.service';
import { ListenEventsComponent } from './listen-events/listen-events.component';
import { SetEventsComponent } from './set-events/set-events.component';
import { EmitEventComponent } from './emit-event/emit-event.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StringifyPipe} from '../shared/pipes/stringify.pipe';

@NgModule({
  declarations: [
    PrincipalViewComponent,
    ListenEventsComponent,
    SetEventsComponent,
    EmitEventComponent,
    StringifyPipe
  ],
  imports: [
    CommonModule,
    SocketTestRoutingModule,
    NgbAlertModule,
    NgbNavModule,
    NgbToastModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SocketTestService]
})
export class SocketTestModule { }
