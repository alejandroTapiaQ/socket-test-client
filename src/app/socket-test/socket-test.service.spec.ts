import { TestBed } from '@angular/core/testing';

import { SocketTestService } from './socket-test.service';

describe('SocketTestService', () => {
  let service: SocketTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
