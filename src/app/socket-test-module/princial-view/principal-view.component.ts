import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {EventResponse} from '../../shared/interfaces';
import {takeUntil} from 'rxjs/operators';
import indexOf from 'lodash-es/indexOf';
import { SocketTestService } from '../socket-test.service';

/**
 * Main component
 *
 * @export
 * @class PrincipalViewComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
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

  /**
   * Creates an instance of PrincipalViewComponent.
   * @param {FormBuilder} formBuilder
   * @param {SocketTestService} socketTestService
   * @memberof PrincipalViewComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private socketTestService: SocketTestService
  ) {
  }

  /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time, and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
   * @see https://angular.io/api/core/OnInit#ngoninit
   * @memberof PrincipalViewComponent
   */
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

  /**
   * Get connectForm control
   *
   * @readonly
   * @memberof PrincipalViewComponent
   */
  get form() {
    return this.connectForm.controls;
  }

  /**
   * Get listenForm Control
   *
   * @readonly
   * @memberof PrincipalViewComponent
   */
  get getListenForms() {
    return this.listenForm.controls;
  }

  /**
   * Get headerForm control
   *
   * @readonly
   * @memberof PrincipalViewComponent
   */
  get getHeaderForm() {
    return this.headerForm.get('headers') as FormArray;
  }

  /**
   * Initialize header Form
   *
   * @returns {FormGroup}
   * @memberof PrincipalViewComponent
   */
  public intializeHeaderForm(): FormGroup {
    return this.formBuilder.group({
      key: [null],
      value: [null],
    });
  }


  /**
   * Connect to socket action
   *
   * @memberof PrincipalViewComponent
   */
  public connectSocket(): void {
    if (!this.connectForm.invalid) {
      const { url } = this.connectForm.value;
      const { headers } = this.headerForm.value;
      this.socketTestService.initSocketConnection(url, headers);
      this.connectionStatus();
    }
  }

  /**
   * Include socket options
   *
   * @memberof PrincipalViewComponent
   */
  public addCustomHeader(): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.push(this.intializeHeaderForm());
  }

  /**
   * Remove socket option
   *
   * @param {number} index
   * @memberof PrincipalViewComponent
   */
  public removeCustomHeader(index: number): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.removeAt(index);
  }

  /**
   * Subscribe to some custom events from socket
   *
   * @memberof PrincipalViewComponent
   */
  public connectionStatus(): void {
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

  /**
   * Disconnect from socket
   *
   * @memberof PrincipalViewComponent
   */
  public disoconnectSocket(): void {
    this.socketTestService.disconnectSocket();
    this.connectForm.get('url').enable();
    const control = this.headerForm.get('headers') as FormArray;
    control.enable();
    this.active = 1;
  }

  /**
   * Header change behabior and clear it control on change
   *
   * @memberof PrincipalViewComponent
   */
  public headerChange(): void {
    const control = this.headerForm.get('headers') as FormArray;
    control.clear();
  }

  /**
   * Add event to listen
   *
   * @memberof PrincipalViewComponent
   */
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

  /**
   * Remove event to listen
   *
   * @param {string} eventName
   * @memberof PrincipalViewComponent
   */
  public removeEvent(eventName: string): void {
    const index = indexOf(this.eventList, eventName);
    if (index >= 0) {
      this.eventList.splice(index, 1);
    }
  }

  /**
   * Track by function for ngfor loop
   *
   * @param {number} index index of curent item
   * @param {string} item item data
   * @returns {string}
   * @memberof PrincipalViewComponent
   */
  public trackByNameEvent(index: number, item: string): string {
    if (!item) {
      return null;
    }
    return item;
  }

  /**
   * Clear all list of events that are listening
   *
   * @memberof PrincipalViewComponent
   */
  public clearMessages(): void {
    this.socketTestService.clearMessages();
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately before a directive, pipe, or service instance is destroyed.
   * @see https://angular.io/api/core/OnDestroy#methods
   * @memberof PrincipalViewComponent
   */
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
