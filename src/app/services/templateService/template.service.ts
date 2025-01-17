import {inject, Injectable, signal} from '@angular/core';
import {CreateTemplate, NotificationTemplate} from '../../models/CreateTemplate';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private backendUrl = environment.backendUrl + "/notification/template";
  private http = inject(HttpClient);
  currentTemplate = signal<NotificationTemplate | null>(null);

  saveTemplate(template: CreateTemplate) {
    this.http.post<NotificationTemplate>(`${this.backendUrl}`, template).subscribe({
      next: (response) => {
        this.currentTemplate.set(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      },
    });
  }

  getTemplate(templateName: string) {
    this.http.get<NotificationTemplate>(`${this.backendUrl}/${templateName}`).subscribe({
      next: (response) => {
        this.currentTemplate.set(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      },
    });
  }
}
