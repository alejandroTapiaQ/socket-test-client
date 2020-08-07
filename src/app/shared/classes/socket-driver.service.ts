import * as io from 'socket.io-client';
import {Observable, Observer} from 'rxjs';
import ConnectOpts = SocketIOClient.ConnectOpts;
import {EventResponse} from '../interfaces';

export interface SocketInterface {
  connect(url: string, options: ConnectOpts): void;
  on(eventName: string): Observable<EventResponse>;
  emit(eventName: string, data: any): void;
  disconnect(): void;
  removeListener(eventName: string): void;
  socketStatus(): boolean;
  IO(): any;
}

export abstract class SocketDriverService implements SocketInterface{
  private socket;

  connect(url: string, options: ConnectOpts): void {
    this.socket = io(url, options);
  }

  IO(): any {
    return this.socket;
  }

  socketStatus(): boolean {
    if (this.socket.connected) {
      return  true;
    } else {
      return false;
    }
  }

  abstract on(eventName: string): Observable<EventResponse>;

  emit(eventName: string, data: any): void {
    try {
      const auxData = JSON.parse(data);
      this.socket.emit(eventName, auxData);
    } catch (e) {
      this.socket.emit(eventName, { data });
    }
  }

  disconnect(): void {
    this.socket.off();
    this.socket.destroy();
    delete this.socket;
  }

  removeListener(eventName: string): void {
    this.socket.off(eventName);
  }
}

