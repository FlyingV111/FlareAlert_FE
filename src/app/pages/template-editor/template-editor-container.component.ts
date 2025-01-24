import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {TemplateService} from '../../services/templateService/template.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CreateTemplate,
  NotificationTemplate,
  NotificationTemplateSettings,
  Template
} from '../../models/CreateTemplate';
import {ActivatedRoute} from '@angular/router';
import {TemplateSettingsComponent} from './components/template-settings/template-settings.component';
import {TemplateEditorComponent} from './components/template-editor/template-editor.component';

@Component({
  selector: 'app-email-editor',
  imports: [
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    TemplateSettingsComponent,
    TemplateEditorComponent
  ],
  templateUrl: './template-editor-container.component.html',
  styleUrl: './template-editor-container.component.css'
})
export class TemplateEditorContainerComponent implements OnInit {
  private templateService = inject(TemplateService)
  private route = inject(ActivatedRoute)
  protected currentTemplate = signal<NotificationTemplate | null>(null)
  private templateSettingsValues = signal<NotificationTemplateSettings | null>(null)
  private templateValues = signal<Template | null>(null)
  private isTemplateFormValid = false;
  private isSettingsFormValid = false;

  constructor() {
    effect(() => {
      this.currentTemplate = this.templateService.currentTemplate
    });
  }

  ngOnInit(): void {
    this.getTemplate()
  }

  protected onTemplateSettingsValuesChanged(values: NotificationTemplateSettings) {
    this.templateSettingsValues.set(values);
  }

  protected onTemplateValuesChanged(template: Template) {
    this.templateValues.set(template)
  }

  protected updateTemplateFormValidity(isValid: boolean): void {
    this.isTemplateFormValid = isValid;
  }

  protected updateSettingsFormValidity(isValid: boolean): void {
    this.isSettingsFormValid = isValid;
  }

  protected isSaveDisabled(): boolean {
    return !(this.isTemplateFormValid && this.isSettingsFormValid);
  }

  protected getTemplate() {
    const templateName = this.route.snapshot.queryParamMap.get('templateName');
    if (templateName) {
      this.templateService.getTemplate(templateName);
    }
  }

  protected saveSettings() {
    if (this.isTemplateFormValid && this.isSettingsFormValid) {
      const createTemplateObject: CreateTemplate = {
        notificationTemplateSettings: this.templateSettingsValues()!,
        templateName: this.templateValues()!.templateName,
        templateContent: this.templateValues()!.templateContent
      }
      this.templateService.saveTemplate(createTemplateObject);
    }
  }
}
