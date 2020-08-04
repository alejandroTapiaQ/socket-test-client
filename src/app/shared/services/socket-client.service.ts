import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import size from 'lodash-es/size';
import each from 'lodash-es/each';
import ConnectOpts = SocketIOClient.ConnectOpts;
import {Observable, Observer, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SocketClientService {
  private socket;

  constructor() { }

  public initSocketConnection(url: string, headers: ConnectOpts) {
    let options = {
      autoConnect: true,
    };
    if (size(headers)) {
      each(headers, (v, k) => {
        options = {...options, ...{[v.key]: v.value}};
      });
    }
    this.socket = io(url, options);
  }

  public onError(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
        this.socket.on('error', (message) => {
          observer.next(message);
          observer.complete();
        });
    });
  }
  public onConnect(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
        this.socket.on('connect', (message) => {
          observer.next(true);
          observer.complete();
        });
    });
  }
}
