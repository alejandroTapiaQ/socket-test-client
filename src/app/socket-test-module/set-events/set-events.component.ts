import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {EventResponse} from '../../shared/interfaces';
import { SocketTestService } from '../socket-test.service';

/**
 * Set listen event component
 *
 * @export
 * @class SetEventsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-set-events',
  templateUrl: './set-events.component.html',
  styleUrls: ['./set-events.component.scss']
})
export class SetEventsComponent implements OnInit, OnDestroy {
  @Input() public eventName: string;
  @Output() public removeEvent: EventEmitter<any> = new EventEmitter();
  private onDestroy$ = new Subject();

  /**
   * Creates an instance of SetEventsComponent.
   * @param {SocketTestService} socketTestService
   * @memberof SetEventsComponent
   */
  constructor(
    private socketTestService: SocketTestService
  ) { }

  /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time, and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
   * @see https://angular.io/api/core/OnInit#ngoninit
   * @memberof SetEventsComponent
   */
  ngOnInit(): void {
    this.socketTestService.connectedSocketAsObservable$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((status) => {
        if (status) {
          this.listenEvent();
        }
      });
  }

  /**
   * Close event
   *
   * @memberof SetEventsComponent
   */
  public closeEvent(): void {
    this.removeEvent.emit(this.eventName);
  }

  /**
   * Listen event from socket server
   *
   * @private
   * @memberof SetEventsComponent
   */
  private listenEvent(): void {
    this.socketTestService.on(this.eventName)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        this.socketTestService.setListenMessage(message);
      });
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately before a directive, pipe, or service instance is destroyed.
   * @see https://angular.io/api/core/OnDestroy#methods
   * @memberof SetEventsComponent
   */
  ngOnDestroy() {
    this.socketTestService.removeListener(this.eventName);
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
