import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEditorContainerComponent } from './template-editor-container.component';

describe('EmailEditorComponent', () => {
  let component: TemplateEditorContainerComponent;
  let fixture: ComponentFixture<TemplateEditorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateEditorContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateEditorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
