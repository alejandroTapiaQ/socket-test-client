import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {EventResponse} from '../interfaces';

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
    private socketClientService: SocketClientService
  ) { }

  ngOnInit(): void {
    this.socketClientService.connectedSocketAsObservable$
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
    this.socketClientService.listenEvent(this.eventName)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        this.socketClientService.setListenMessage(message);
      });
  }

  ngOnDestroy() {
    this.socketClientService.removeListener(this.eventName);
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
