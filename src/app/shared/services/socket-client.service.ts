import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import size from 'lodash-es/size';
import each from 'lodash-es/each';
import ConnectOpts = SocketIOClient.ConnectOpts;
import {Observable, Observer} from 'rxjs';
import {EventResponse} from "../../socket-test-module/interfaces";

@Injectable({
  providedIn: 'root'
})

export class SocketClientService {
  private socket;

  constructor() { }

  public initSocketConnection(url: string, headers: ConnectOpts) {
    let options = {
      autoConnect: true
    };
    if (size(headers)) {
      each(headers, (v, k) => {
        options = {...options, ...{[v.key]: v.value}};
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
        } else if (eventName === 'disconnect') {
          observer.next({
            data: false,
            eventName
          });
        } else {
          observer.next({
            data,
            eventName
          });
        }
        observer.complete();
      });
    });
  }

  public disconnectSocket(): boolean {
    this.socket.off();
    this.socket.destroy();
    delete this.socket;
    return false;
  }
}
