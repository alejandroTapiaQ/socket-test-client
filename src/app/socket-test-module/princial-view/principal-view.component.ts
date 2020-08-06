import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Subject} from 'rxjs';
import {EventResponse} from '../interfaces';
import {takeUntil} from 'rxjs/operators';
import indexOf from 'lodash-es/indexOf';

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
  private onDestroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private socketClientService: SocketClientService
  ) {
  }

  ngOnInit(): void {
    this.connectForm = this.formBuilder.group({
      url: ['http://localhost:8000/v2', [Validators.required, Validators.pattern(/^https?:\/\//)]]
    });
    this.headerForm = this.formBuilder.group({
      headers: this.formBuilder.array([])
    });
    this.listenForm = this.formBuilder.group({
      eventName: [null, Validators.required],
    });
  }

  get form() {
    return this.connectForm.controls;
  }

  get listenForms() {
    return this.listenForm.controls;
  }

  get getFormHeaders() {
    return this.headerForm.get('headers') as FormArray;
  }

  public intializeHeaderForm(): FormGroup {
    return this.formBuilder.group({
      key: ['query'],
      value: ['token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJpc0JhciI6ZmFsc2UsInpiVXNlcklkIjoiMi11Iiwicm9sZSI6IlpCX0NMSUVOVCIsImZ1bGxOYW1lIjoiRG9uIGNhcmxvcyIsInByb2ZpbGVQaWN0dXJlIjoiIn0sImlhdCI6MTU5NjIwODM3OX0.b5zUDHchGmZUay-9Q1rrxTKP7gBUOo4_RxvNxZBelzQ'],
    });
  }

  public connectSocket(): void {
    if (!this.connectForm.invalid) {
      const { url } = this.connectForm.value;
      const { headers } = this.headerForm.value;
      this.socketClientService.initSocketConnection(url, headers);
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
    this.socketClientService.listenEvent('error')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'error' && message.data.type === 'UnauthorizedError') {
          this.socketConnected = false;
          this.socketClientService.socketStatusConnection(false);
          this.connectForm.get('url').enable();
          const control = this.headerForm.get('headers') as FormArray;
          control.enable();
        }
      });
    this.socketClientService.listenEvent('disconnect')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'disconnect') {
          this.disoconnectSocket();
        }
      });
    this.socketClientService.listenEvent('connect')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'connect') {
          this.socketConnected = message.data;
          this.socketClientService.socketStatusConnection(true);
          this.connectForm.get('url').disable();
          const control = this.headerForm.get('headers') as FormArray;
          control.disable();
        }
      });
  }

  public disoconnectSocket(): void {
    this.socketConnected = this.socketClientService.disconnectSocket();
    this.connectForm.get('url').enable();
    const control = this.headerForm.get('headers') as FormArray;
    control.enable();
  }

  public useHeaderChange(): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.clear();
  }

  public addEvent(): void {
    if (!this.listenForm.invalid) {
      const { eventName } = this.listenForm.value;
      this.eventList.push(eventName);
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
    this.socketClientService.clearMessages();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
