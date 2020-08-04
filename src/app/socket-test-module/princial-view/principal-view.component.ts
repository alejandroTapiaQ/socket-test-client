import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-socket-test',
  templateUrl: './principal-view.component.html',
  styleUrls: ['./principal-view.component.scss']
})
export class PrincipalViewComponent implements OnInit {
  public useHeaders = false;
  public active = 1;
  public connectForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.connectForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\//)]]
    });
  }
  // convenience getter for easy access to form fields
  get form() { return this.connectForm.controls; }

  public connectSocket() {
    if (this.connectForm.invalid) {
      console.log('no valid');
    } else {
      console.log('is valid');
    }
  }

}
