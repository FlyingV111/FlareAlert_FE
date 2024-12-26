import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAlertComponent } from './current-alert.component';

describe('CurrentAlertComponent', () => {
  let component: CurrentAlertComponent;
  let fixture: ComponentFixture<CurrentAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
