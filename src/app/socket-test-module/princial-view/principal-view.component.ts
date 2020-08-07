import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {EventResponse} from '../../shared/interfaces';
import {takeUntil} from 'rxjs/operators';
import indexOf from 'lodash-es/indexOf';
import { SocketTestService } from '../socket-test.service';

@Component({
  selector: 'app-socket-test',
  templateUrl: './principal-view.component.html',
  styleUrls: ['./principal-view.component.scss']
})

export class PrincipalViewComponent implements OnInit, OnDestroy {
  public useHeaders = false;
  public active = 1;
  public connectForm: FormGroup;
  public headerForm: FormGroup;
  public listenForm: FormGroup;
  public socketConnected = false;
  public eventList: string[] = [];
  public alreadyLisenetingEvent = false;
  private onDestroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private socketTestService: SocketTestService
  ) {
  }

  ngOnInit(): void {
    this.connectForm = this.formBuilder.group({
      url: [null, [Validators.required, Validators.pattern(/^https?:\/\//)]]
    });
    this.headerForm = this.formBuilder.group({
      headers: this.formBuilder.array([])
    });
    this.listenForm = this.formBuilder.group({
      eventName: [null, Validators.required],
    });
    this.socketTestService.connectedSocketAsObservable$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((connected) => {
        this.socketConnected = connected;
      });
  }

  get form() {
    return this.connectForm.controls;
  }

  get getListenForms() {
    return this.listenForm.controls;
  }

  get getFormHeaders() {
    return this.headerForm.get('headers') as FormArray;
  }

  public intializeHeaderForm(): FormGroup {
    return this.formBuilder.group({
      key: [null],
      value: [null],
    });
  }

  public connectSocket(): void {
    if (!this.connectForm.invalid) {
      const { url } = this.connectForm.value;
      const { headers } = this.headerForm.value;
      this.socketTestService.initSocketConnection(url, headers);
      this.connectionStatus();
    }
  }

  public addCustomHeader(): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.push(this.intializeHeaderForm());
  }

  public removeCustomHeader(index: number): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.removeAt(index);
  }

  public connectionStatus() {
    this.socketTestService.on('error')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'error' && message.data.type === 'UnauthorizedError') {
          this.socketTestService.socketStatusConnection(false);
          this.connectForm.get('url').enable();
          const control = this.headerForm.get('headers') as FormArray;
          control.enable();
        }
      });
    this.socketTestService.on('disconnect')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'disconnect') {
          this.disoconnectSocket();
        }
      });
    this.socketTestService.on('connect')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'connect') {
          this.socketTestService.socketStatusConnection(true);
          this.connectForm.get('url').disable();
          const control = this.headerForm.get('headers') as FormArray;
          control.disable();
        }
      });
  }

  public disoconnectSocket(): void {
    this.socketTestService.disconnectSocket();
    this.connectForm.get('url').enable();
    const control = this.headerForm.get('headers') as FormArray;
    control.enable();
    this.active = 1;
  }

  public useHeaderChange(): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.clear();
  }

  public addEvent(): void {
    if (!this.listenForm.invalid) {
      const { eventName } = this.listenForm.value;
      const index = indexOf(this.eventList, eventName);
      if (index < 0) {
        this.eventList.push(eventName);
      } else {
        this.alreadyLisenetingEvent = true;
        setTimeout(() => {
          this.alreadyLisenetingEvent = false;
        }, 1500);
      }
      this.listenForm.reset();
    }
  }

  public removeEvent(eventName: string): void {
    const index = indexOf(this.eventList, eventName);
    if (index >= 0) {
      this.eventList.splice(index, 1);
    }
  }

  public trackByNameEvent(index: number, item: string): string {
    if (!item) {
      return null;
    }
    return item;
  }

  public clearMessages(): void {
    this.socketTestService.clearMessages();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
