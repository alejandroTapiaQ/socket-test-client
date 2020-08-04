import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SocketClientService} from '../../shared/services/socket-client.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

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
  public socketConnected = false;
  private onDestroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private socketClientService: SocketClientService
  ) {
  }

  ngOnInit(): void {
    this.connectForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\//)]]
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
      key: [null],
      value: [null],
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
    this.socketClientService.onError()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(message => {
        if (message.type === 'UnauthorizedError') {
          this.socketConnected = false;
        }
      });
    this.socketClientService.onConnect()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(message => {
        if (message) {
          this.socketConnected = true;
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
