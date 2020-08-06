export interface EventResponse {
  eventName: string;
  data: any;
}

export interface ListEvents extends EventResponse{
  id: number;
}
