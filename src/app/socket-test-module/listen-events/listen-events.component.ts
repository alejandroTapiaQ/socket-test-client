import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ListEvents} from '../../shared/interfaces';
import { SocketTestService } from '../socket-test.service';

/**
 * Listen event component
 *
 * @export
 * @class ListenEventsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-listen-events',
  templateUrl: './listen-events.component.html',
  styleUrls: ['./listen-events.component.scss']
})
export class ListenEventsComponent implements OnInit {
  public events$: Observable<ListEvents>;

  /**
   * Creates an instance of ListenEventsComponent.
   * @param {SocketTestService} socketTestService
   * @memberof ListenEventsComponent
   */
  constructor(
    private socketTestService: SocketTestService
  ) { }

  /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time, and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
   * @see https://angular.io/api/core/OnInit#ngoninit
   * @memberof ListenEventsComponent
   */
  ngOnInit(): void {
    this.events$ = this.socketTestService.messageEventSubjectAsObservable$;
  }

  /**
   * Track by function for ngfor loop
   *
   * @param {number} index Index of current item
   * @param {ListEvents} item Item data
   * @returns {number}
   * @memberof ListenEventsComponent
   */
  public trackByIdEvent(index: number, item: ListEvents): number {
    if (!item) {
      return null;
    }
    return item.id;
  }

  /**
   * Remove Message from list events
   *
   * @param {number} index
   * @param {ListEvents} event
   * @memberof ListenEventsComponent
   */
  public removeMessage(index: number, event: ListEvents): void {
    this.socketTestService.removeAMessage(event.id);
  }

}
