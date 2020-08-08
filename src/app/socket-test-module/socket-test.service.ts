import { Injectable } from '@angular/core';
import size from 'lodash-es/size';
import each from 'lodash-es/each';
import orderBy from 'lodash-es/orderBy';
import findIndex from 'lodash-es/findIndex';
import ConnectOpts = SocketIOClient.ConnectOpts;
import Socket = SocketIOClient.Socket;
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import {EventResponse, ListEvents} from '../shared/interfaces';
import {SocketDriverClass} from '../shared/classes/socket-driver.class';

/**
 * Socket Test service in order to handle socket connection
 *
 * @class SocketTestService
 * @extends {SocketDriverClass}
 */
@Injectable({
  providedIn: 'root'
})


export class SocketTestService extends SocketDriverClass {
  private connectedSocketSubject = new BehaviorSubject<any>(false);
  public connectedSocketAsObservable$ = this.connectedSocketSubject.asObservable();
  private messageEventSubject = new BehaviorSubject<any>([]);
  public messageEventSubjectAsObservable$ = this.messageEventSubject.asObservable();
  private listEvents: ListEvents[] = new Array<ListEvents>();

  /**
   * Creates an instance of SocketTestService.
   * @memberof SocketTestService
   */
  constructor() {
    super();
  }

  /**
   * Init socket connection
   *
   * @param {string} url url string
   * @param {ConnectOpts} headers Socket options configurations
   * @memberof SocketTestService
   */
  public initSocketConnection(url: string, headers: ConnectOpts): void {
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
    this.connect(url, options);
    setTimeout(() => {
      if (!this.socketStatus()) {
        this.disconnect();
      }
    }, 200);
  }


  /**
   * listen to handle incoming events from socket server function inheritance from socket driver abstract class
   *
   * @param {string} eventName Evnet name to listen
   * @returns {Observable<EventResponse>}
   * @memberof SocketTestService
   */
  public on(eventName: string): Observable<EventResponse> {
    return new Observable((observer: Observer<EventResponse>) => {
      const socket: Socket = this.IO();
      socket.on(eventName, (data) => {
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


  /**
   * Set socket status connction
   *
   * @param {boolean} connected
   * @memberof SocketTestService
   */
  public socketStatusConnection(connected: boolean): void {
    this.connectedSocketSubject.next(connected);
  }


  /**
   * Disconnect from socket
   *
   * @memberof SocketTestService
   */
  public disconnectSocket(): void {
    this.disconnect();
    this.socketStatusConnection(false);
  }

  /**
   * Manege incoming messages from listened events
   *
   * @param {EventResponse} data
   * @memberof SocketTestService
   */
  public setListenMessage(data: EventResponse): void {
    const auxData: ListEvents = {
      eventName: data.eventName,
      data: data.data,
      id: size(this.listEvents) + 1
    };
    this.listEvents.push(auxData);
    this.messageEventSubject.next(orderBy(this.listEvents, ['id'], ['desc']));
  }


  /**
   * Clear all messages lsietened
   *
   * @memberof SocketTestService
   */
  public clearMessages(): void {
    this.listEvents = new Array<ListEvents>();
    this.messageEventSubject.next(this.listEvents);
  }


  /**
   * Remove a specific message listened
   *
   * @param {number} id
   * @memberof SocketTestService
   */
  public removeAMessage(id: number): void {
    const index = findIndex(this.listEvents, { id });
    if (index >= 0) {
      this.listEvents.splice(index, 1);
      this.messageEventSubject.next(orderBy(this.listEvents, ['id'], ['desc']));
    }
  }
}
