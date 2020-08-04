import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listen-events',
  templateUrl: './listen-events.component.html',
  styleUrls: ['./listen-events.component.scss']
})
export class ListenEventsComponent implements OnInit {
  public show = true;
  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    this.show = false;
  }

}
