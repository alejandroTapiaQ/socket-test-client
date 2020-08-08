export type Data<T> = T;
/**
 * Response of listened event
 *
 * @export
 * @interface EventResponse
 */
export interface EventResponse {
  /**
   * Event Name
   *
   * @type {string}
   * @memberof EventResponse
   */
  eventName: string;
  /**
   * Date reponse from socket server
   *
   * @type {(Data<string|boolean|object|number>)}
   * @memberof EventResponse
   */
  data: Data<string|boolean|object|number|any>;
}
/**
 * Simple listened event
 *
 * @export
 * @interface ListEvents
 * @extends {EventResponse}
 */
export interface ListEvents extends EventResponse{
  id: number;
}
