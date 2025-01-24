import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ApiKey, Webhook, WebhookUrl} from '../../models/Webhook';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private backendUrl = environment.backendUrl + '/user';
  webhook = signal<Webhook | null>(null);
  loadingWebhook = signal<boolean>(false);
  loadingApiKey = signal<boolean>(false);
  loadingWebhookUrl = signal<boolean>(false);

  generateWebhookUrl() {
    this.loadingWebhookUrl.set(true);
    this.http.get<WebhookUrl>(`${this.backendUrl}/webhook/generate/url`).subscribe({
      next: (response) => {
        if (!response.webhookUrl.startsWith(this.baseUrl)) {
          response.webhookUrl = this.baseUrl + response.webhookUrl;
        }

        this.webhook.update((webhook) => {
          return webhook ? {...webhook, webhookUrl: response.webhookUrl} : null;
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loadingWebhookUrl.set(false);
      },
    });
  }

  generateApiKey() {
    this.loadingApiKey.set(true);
    this.http.get<ApiKey>(`${this.backendUrl}/webhook/generate/apikey`).subscribe({
      next: (response) => {
        this.webhook.update((webhook) => {
          return webhook ? {...webhook, apiKey: response.apiKey} : null;
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loadingApiKey.set(false);
      },
    });
  }

  getWebhookUrl() {
    this.loadingWebhook.set(true);
    this.http.get<Webhook>(`${this.backendUrl}/webhook`).subscribe({
      next: (response) => {
        if (!response.webhookUrl.startsWith(this.baseUrl)) {
          response.webhookUrl = this.baseUrl + response.webhookUrl;
        }
        this.webhook.set(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loadingWebhook.set(false);
      },
    });
  }

  updateWebhookEnabled(enabled: boolean) {
    this.http.put<Webhook>(`${this.backendUrl}/webhookEnabled`, {webhookEnabled: enabled}).subscribe({
      next: (response) => {
        this.webhook.set(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      },
    });
  }
}
