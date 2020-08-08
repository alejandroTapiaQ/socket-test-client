import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import { SocketTestService } from '../socket-test.service';

/**
 * Emit event component
 *
 * @export
 * @class EmitEventComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-emit-event',
  templateUrl: './emit-event.component.html',
  styleUrls: ['./emit-event.component.scss']
})


export class EmitEventComponent implements OnInit {
  public socketStatus$: Observable<boolean>;
  public emitForm: FormGroup;
  public showEmmitedMessage = false;

  /**
   * Creates an instance of EmitEventComponent.
   * @param {FormBuilder} formBuilder
   * @param {SocketTestService} socketTestService
   * @memberof EmitEventComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private socketTestService: SocketTestService
  ) { }

  /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time, and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
   * @see https://angular.io/api/core/OnInit#ngoninit
   * @memberof EmitEventComponent
   */
  ngOnInit(): void {
    this.socketStatus$ = this.socketTestService.connectedSocketAsObservable$;
    this.emitForm = this.formBuilder.group({
      eventName: [null, Validators.required],
      message:  [null]
    });
  }

  /**
   * Get emitForm control
   *
   * @readonly
   * @memberof EmitEventComponent
   */
  get form() {
    return this.emitForm.controls;
  }

  /**
   * Emit message to socket server connected
   *
   * @memberof EmitEventComponent
   */
  public sendMessage(): void {
    if (!this.emitForm.invalid) {
      this.showEmmitedMessage = true;
      const eventName: string = this.emitForm.value.eventName;
      const message: string = this.emitForm.value.message;
      this.socketTestService.emit(eventName, message);
      this.emitForm.reset();
      setTimeout(() => {
        this.showEmmitedMessage = false;
      }, 1500);
    }
  }
}
