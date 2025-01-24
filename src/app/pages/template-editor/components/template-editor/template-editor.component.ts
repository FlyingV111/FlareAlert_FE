import {Component, effect, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LucideAngularModule} from 'lucide-angular';
import {Template} from '../../../../models/CreateTemplate';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'template-editor',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent {
  @Output() onFormValidityChange = new EventEmitter<boolean>();
  @Output() onTemplateValuesChanged = new EventEmitter<Template>();
  @Input() template = signal<Template | null>(null);
  protected templateForm: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.templateForm = new FormGroup({
      templateName: new FormControl(this.template()?.templateName || '', Validators.required),
      templateDescription: new FormControl(this.template()?.templateDescription || ''),
      templateContent: new FormControl(this.template()?.templateContent || '')
    });

    this.templateForm.statusChanges.subscribe(() => {
      this.onFormValidityChange.emit(this.templateForm.valid);
      this.onEmitTemplateValuesChanged();
      this.updateUrlWithTemplateName();
    });

    effect(() => {
      this.templateForm.patchValue({
        templateName: this.template()?.templateName,
        templateDescription: this.template()?.templateDescription,
        templateContent: this.template()?.templateContent
      });
    });
  }

  private onEmitTemplateValuesChanged() {
    if (this.templateForm.valid) this.onTemplateValuesChanged.emit(this.templateForm.value);
  }

  private updateUrlWithTemplateName() {
    const templateName = this.templateForm.get('templateName')?.value;

    if (templateName) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {templateName: templateName},
        queryParamsHandling: 'merge'
      }).then();
    }
  }
}
