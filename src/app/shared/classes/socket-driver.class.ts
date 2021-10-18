import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import {EventResponse} from '../interfaces';
/**
 * Socket Interface of abstract class
 *
 * @export
 * @interface SocketInterface
 */
export interface SocketInterface {
  connect(url: string, options: io.ManagerOptions): void;
  on(eventName: string): Observable<EventResponse>;
  emit<T extends string>(eventName: T, data: T): void;
  disconnect(): void;
  removeListener(eventName: string): void;
  socketStatus(): boolean;
  IO<T>(): T;
}

/**
 * Socket driver class create an interface for socket
 *
 * @export
 * @abstract
 * @class SocketDriverClass
 * @implements {SocketInterface}
 */
export abstract class SocketDriverClass implements SocketInterface{
  /**
   * Socket instance
   *
   * @private
   * @memberof SocketDriverClass
   */
  private socket;

  /**
   * Socket connection
   *
   * @param {string} url path url
   * @param {ConnectOpts} options socket configuration options
   * @memberof SocketDriverClass
   */
  connect(url: string, options: Partial<io.ManagerOptions>): void {
    this.socket = io.connect(url, options);
  }

  /**
   * Socket instance
   *
   * @template T
   * @returns {T} Current socket instance
   * @memberof SocketDriverClass
   */
  IO<T>(): T {
    return this.socket;
  }

  /**
   * Get socket current status connected or not connected
   *
   * @returns {boolean}
   * @memberof SocketDriverClass
   */
  socketStatus(): boolean {
    if (this.socket.connected) {
      return  true;
    } else {
      return false;
    }
  }

  /**
   * Abstract function in order to listen events must implement in your class
   *
   * @abstract
   * @param {string} eventName
   * @returns {Observable<EventResponse>}
   * @memberof SocketDriverClass
   */
  abstract on(eventName: string): Observable<EventResponse>;

  /**
   * Emit socket function
   *
   * @template T
   * @param {T} eventName Name of evento to emit
   * @param {T} data Attach data message
   * @memberof SocketDriverClass
   */
  emit<T extends string>(eventName: T, data: T): void {
    try {
      const auxData = JSON.parse(data);
      this.socket.emit(eventName, auxData);
    } catch (e) {
      this.socket.emit(eventName, { data });
    }
  }

  /**
   * Disconnect from socket
   *
   * @memberof SocketDriverClass
   */
  disconnect(): void {
    this.socket.off();
    this.socket.destroy();
    delete this.socket;
  }

  /**
   * Remove subscrition of an event
   *
   * @param {string} eventName
   * @memberof SocketDriverClass
   */
  removeListener(eventName: string): void {
    this.socket.off(eventName);
  }
}

