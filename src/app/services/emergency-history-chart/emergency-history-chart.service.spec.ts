import { TestBed } from '@angular/core/testing';

import { EmergencyHistoryChartService } from './emergency-history-chart.service';

describe('EmergencyHistoryChartService', () => {
  let service: EmergencyHistoryChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyHistoryChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
