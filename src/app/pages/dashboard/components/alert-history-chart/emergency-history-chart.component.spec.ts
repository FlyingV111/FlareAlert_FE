import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyHistoryChartComponent } from './emergency-history-chart.component';

describe('AlertHistoryChartComponent', () => {
  let component: EmergencyHistoryChartComponent;
  let fixture: ComponentFixture<EmergencyHistoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyHistoryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
