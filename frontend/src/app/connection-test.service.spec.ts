import { TestBed } from '@angular/core/testing';

import { ConnectionTestService } from './connection-test.service';

describe('ConnectionTestService', () => {
  let service: ConnectionTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
