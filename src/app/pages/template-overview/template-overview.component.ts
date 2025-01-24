import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {NgForOf} from '@angular/common';
import {LucideAngularModule} from 'lucide-angular';
import {TemplateService} from '../../services/templateService/template.service';
import {Router, RouterLink} from '@angular/router';
import {NotificationTemplate} from '../../models/CreateTemplate';

@Component({
  selector: 'app-template-overview',
  imports: [
    NgForOf,
    LucideAngularModule,
    RouterLink
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
