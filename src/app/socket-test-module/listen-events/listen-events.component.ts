import { Component, OnInit } from '@angular/core';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Observable} from 'rxjs';
import {ListEvents} from '../interfaces';

@Component({
  selector: 'app-listen-events',
  templateUrl: './listen-events.component.html',
  styleUrls: ['./listen-events.component.scss']
})
export class ListenEventsComponent implements OnInit {
  public events: Observable<ListEvents>;
  constructor(
    private socketClientService: SocketClientService
  ) { }

  ngOnInit(): void {
    this.events = this.socketClientService.messageEventSubjectAsObservable$;
  }

  public trackByIdEvent(index: number, item: ListEvents): number {
    if (!item) {
      return null;
    }
    return item.id;
  }

  public removeMessage(index: number, event: ListEvents): void {
    this.socketClientService.removeAMessage(event.id);
  }

}
