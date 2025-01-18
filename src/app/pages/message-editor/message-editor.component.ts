import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {TemplateService} from '../../services/templateService/template.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotificationTemplate} from '../../models/CreateTemplate';
import {ActivatedRoute, Router} from '@angular/router';
import {TemplateEditorComponent} from './components/template-editor/template-editor.component';
import {TemplateSettingsComponent} from './components/template-settings/template-settings.component';

@Component({
  selector: 'app-email-editor',
  imports: [
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    TemplateEditorComponent,
    TemplateSettingsComponent
  ],
  templateUrl: './message-editor.component.html',
  styleUrl: './message-editor.component.css'
})
export class MessageEditorComponent implements OnInit {
  protected currentTemplate = signal<NotificationTemplate | null>(null)
  private templateService = inject(TemplateService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  constructor() {


    effect(() => {
      this.currentTemplate = this.templateService.currentTemplate
      // this.assignedUsersEmails = this.currentTemplate()?.assignedUsersEmails || [];
      // this.templateForm.get('templateName')?.setValue(this.currentTemplate()?.templateName);
      // this.templateForm.get('templateContent')?.setValue(this.currentTemplate()?.templateContent);
    });
  }

  ngOnInit(): void {
    this.getTemplate()
  }




  protected getTemplate() {
    const templateName = this.route.snapshot.queryParamMap.get('templateName');
    if (templateName) {
      this.templateService.getTemplate(templateName);
    }
  }

  // protected saveTemplate() {
  //   if (this.templateForm.valid) {
  //     const formData: CreateTemplate = this.templateForm.value;
  //     formData.assignedUsersEmails = this.assignedUsersEmails;
  //     this.templateService.saveTemplate(formData)
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //       queryParams: {templateName: formData.templateName},
  //       queryParamsHandling: 'merge'
  //     }).then()
  //   }
  // }
}
