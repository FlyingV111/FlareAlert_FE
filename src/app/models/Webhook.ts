export interface Webhook extends ApiKey, WebhookUrl {
  webhookEnabled: boolean;
}

export interface ApiKey {
  apiKey: string;
}

export interface WebhookUrl {
  webhookUrl: string;
}
