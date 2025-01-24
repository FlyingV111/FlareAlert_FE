import {Day} from './Day';

export interface CreateTemplate extends Template {
  notificationTemplateSettings: NotificationTemplateSettings
}

export interface NotificationTemplate extends CreateTemplate {
  id: string
}

export type Template = {
  templateName: string;
  templateDescription: string;
  templateContent: string;
}

export type NotificationTemplateSettings = {
  defaultStartTime: number | null
  defaultEndTime: number | null
  assignedUserEmails: string[]
  activeDays: Day[]
}
