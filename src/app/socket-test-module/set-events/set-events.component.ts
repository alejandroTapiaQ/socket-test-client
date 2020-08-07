import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {EventResponse} from '../../shared/interfaces';
import { SocketTestService } from '../socket-test.service';

@Component({
  selector: 'app-set-events',
  templateUrl: './set-events.component.html',
  styleUrls: ['./set-events.component.scss']
})
export class SetEventsComponent implements OnInit, OnDestroy {
  @Input() public eventName: string;
  @Output() public removeEvent: EventEmitter<any> = new EventEmitter();
  private onDestroy$ = new Subject();

  constructor(
    private socketTestService: SocketTestService
  ) { }

  ngOnInit(): void {
    this.socketTestService.connectedSocketAsObservable$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((status) => {
        if (status) {
          this.listenEvent();
        }
      });
  }

  public closeEvent(): void {
    this.removeEvent.emit(this.eventName);
  }

  private listenEvent(): void {
    this.socketTestService.on(this.eventName)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        this.socketTestService.setListenMessage(message);
      });
  }

  ngOnDestroy() {
    this.socketTestService.removeListener(this.eventName);
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
