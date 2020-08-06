import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import size from 'lodash-es/size';
import each from 'lodash-es/each';
import orderBy from 'lodash-es/orderBy';
import findIndex from 'lodash-es/findIndex';
import ConnectOpts = SocketIOClient.ConnectOpts;
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {EventResponse, ListEvents} from '../../socket-test-module/interfaces';

@Injectable({
  providedIn: 'root'
})

export class SocketClientService {
  private socket;
  private connectedSocketSubject = new BehaviorSubject<any>(false);
  public connectedSocketAsObservable$ = this.connectedSocketSubject.asObservable();
  private messageEventSubject = new BehaviorSubject<any>([]);
  public messageEventSubjectAsObservable$ = this.messageEventSubject.asObservable();
  private listEvents: ListEvents[] = new Array<ListEvents>();

  constructor() { }

  public initSocketConnection(url: string, headers: ConnectOpts) {
    const jsonParse = (val: string) => {
      try {
        const isJson = JSON.parse(val);
        return isJson;
      } catch (e) {
        return val;
      }
    };

    let options = {
      autoConnect: true
    };
    if (size(headers)) {
      each(headers, (v, k) => {
        options = {...options, ...{[v.key]: jsonParse(v.value)}};
      });
    }
    this.socket = io(url, options);
    setTimeout(() => {
      if (!this.socket.connected) {
        this.socket.off();
        this.socket.destroy();
        delete this.socket;
      }
    }, 200);
  }

  public listenEvent(eventName: string): Observable<EventResponse> {
    return new Observable((observer: Observer<EventResponse>) => {
      this.socket.on(eventName, (data) => {
        if (eventName === 'connect') {
          observer.next({
            data: true,
            eventName
          });
          observer.complete();
        } else if (eventName === 'disconnect') {
          observer.next({
            data: false,
            eventName
          });
          observer.complete();
        } else {
          observer.next({
            data,
            eventName
          });
        }
      });
    });
  }

  public socketStatusConnection(connected: boolean): void {
    this.connectedSocketSubject.next(connected);
  }

  public disconnectSocket(): boolean {
    this.socket.off();
    this.socket.destroy();
    delete this.socket;
    this.socketStatusConnection(false);
    return false;
  }

  public emitMessage(eventName: string, data: string): void {
    try {
      const auxData = JSON.parse(data);
      this.socket.emit(eventName, auxData);
    } catch (e) {
      this.socket.emit(eventName, { data });
    }
  }

  public removeListener(eventName: string): void {
    this.socket.off(eventName);
  }

  public setListenMessage(data: EventResponse): void {
    const auxData: ListEvents = {
      eventName: data.eventName,
      data: data.data,
      id: size(this.listEvents) + 1
    };
    this.listEvents.push(auxData);
    this.messageEventSubject.next(orderBy(this.listEvents, ['id'], ['desc']));
  }

  public clearMessages(): void {
    this.listEvents = new Array<ListEvents>();
    this.messageEventSubject.next(this.listEvents);
  }

  public removeAMessage(id: number): void {
    const index = findIndex(this.listEvents, { id });
    if (index >= 0) {
      this.listEvents.splice(index, 1);
      this.messageEventSubject.next(orderBy(this.listEvents, ['id'], ['desc']));
    }
  }
}
