import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketTestComponent } from './socket-test.component';

describe('SocketTestComponent', () => {
  let component: SocketTestComponent;
  let fixture: ComponentFixture<SocketTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
