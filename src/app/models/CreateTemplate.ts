export type CreateTemplate = {
  templateName: string;
  templateContent: string;
  assignedUsersEmails: string[];
}

export interface NotificationTemplate extends CreateTemplate {
  id: string
}
