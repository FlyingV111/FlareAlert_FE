import { TestBed } from '@angular/core/testing';

import { AlertNotifyService } from './alert-notify.service';

describe('AlertService', () => {
  let service: AlertNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
