import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'template-editor',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.css'
})
export class TemplateEditorComponent {
  protected templateForm: FormGroup

  constructor() {
    this.templateForm = new FormGroup({
      templateName: new FormControl('', Validators.required),
      templateContent: new FormControl('')
    })
  }
}
