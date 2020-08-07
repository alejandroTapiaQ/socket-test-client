import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import { SocketTestService } from '../socket-test.service';

@Component({
    selector: 'app-emit-event',
  templateUrl: './emit-event.component.html',
  styleUrls: ['./emit-event.component.scss']
})

export class EmitEventComponent implements OnInit, OnDestroy {
  public socketStatus$: Observable<boolean>;
  public emitForm: FormGroup;
  public showEmmitedMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private socketTestService: SocketTestService
  ) { }

  ngOnInit(): void {
    this.socketStatus$ = this.socketTestService.connectedSocketAsObservable$;
    this.emitForm = this.formBuilder.group({
      eventName: [null, Validators.required],
      message:  [null]
    });
  }

  get form() {
    return this.emitForm.controls;
  }

  public sendMessage(): void {
    if (!this.emitForm.invalid) {
      this.showEmmitedMessage = true;
      const { eventName } = this.emitForm.value;
      const { message } = this.emitForm.value;
      this.socketTestService.emit(eventName, message);
      this.emitForm.reset();
      setTimeout(() => {
        this.showEmmitedMessage = false;
      }, 1500);
    }
  }

  ngOnDestroy() {}
}
