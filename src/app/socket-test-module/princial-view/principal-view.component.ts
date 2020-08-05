import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EventResponse} from "../interfaces";

@Component({
  selector: 'app-socket-test',
  templateUrl: './principal-view.component.html',
  styleUrls: ['./principal-view.component.scss']
})
@AutoUnsubscribe()
export class PrincipalViewComponent implements OnInit, OnDestroy {
  public useHeaders = false;
  public active = 1;
  public connectForm: FormGroup;
  public headerForm: FormGroup;
  public socketConnected = false;
  private connectEvent: Subscription;
  private disconnectEvent: Subscription;
  private errorEvent: Subscription;

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
  }

  get form() {
    return this.connectForm.controls;
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
    this.connectEvent = this.socketClientService.listenEvent('error')
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'error' && message.data.type === 'UnauthorizedError') {
          this.socketConnected = false;
          this.connectForm.get('url').enable();
          const control = this.headerForm.get('headers') as FormArray;
          control.enable();
        }
      });
    this.disconnectEvent = this.socketClientService.listenEvent('disconnect')
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'disconnect') {
          this.disoconnectSocket();
        }
      });
    this.errorEvent = this.socketClientService.listenEvent('connect')
      .subscribe((message: EventResponse) => {
        if (message.eventName === 'connect') {
          this.socketConnected = message.data;
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

  ngOnDestroy() {}
}
