import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Observable} from 'rxjs';

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
    private socketClientService: SocketClientService
  ) { }

  ngOnInit(): void {
    this.socketStatus$ = this.socketClientService.connectedSocketAsObservable$;
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
      this.socketClientService.emitMessage(eventName, message);
      this.emitForm.reset();
      setTimeout(() => {
        this.showEmmitedMessage = false;
      }, 500);
    }
  }

  ngOnDestroy() {}
}
