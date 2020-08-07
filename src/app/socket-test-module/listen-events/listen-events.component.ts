import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ListEvents} from '../../shared/interfaces';
import { SocketTestService } from '../socket-test.service';

@Component({
  selector: 'app-listen-events',
  templateUrl: './listen-events.component.html',
  styleUrls: ['./listen-events.component.scss']
})
export class ListenEventsComponent implements OnInit {
  public events: Observable<ListEvents>;
  constructor(
    private socketTestService: SocketTestService
  ) { }

  ngOnInit(): void {
    this.events = this.socketTestService.messageEventSubjectAsObservable$;
  }

  public trackByIdEvent(index: number, item: ListEvents): number {
    if (!item) {
      return null;
    }
    return item.id;
  }

  public removeMessage(index: number, event: ListEvents): void {
    this.socketTestService.removeAMessage(event.id);
  }

}
