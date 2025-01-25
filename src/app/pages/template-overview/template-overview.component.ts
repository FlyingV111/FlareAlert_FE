import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {TemplateService} from '../../services/templateService/template.service';
import {NotificationTemplate} from '../../models/CreateTemplate';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-template-overview',
  imports: [
    LucideAngularModule,
    RouterLink,
    NgForOf
  ],
  templateUrl: './template-overview.component.html',
  styleUrl: './template-overview.component.css'
})
export class TemplateOverviewComponent implements OnInit {
  private templateService = inject(TemplateService)
  protected templates = signal<NotificationTemplate[] | null>(null)

  constructor() {
    effect(() => {
      this.templates = this.templateService.templates
    });
  }

  ngOnInit(): void {
    this.templateService.getAllTemplates()
  }

  deleteTemplate(name: string) {
    this.templateService.deleteTemplate(name)
  }
}
