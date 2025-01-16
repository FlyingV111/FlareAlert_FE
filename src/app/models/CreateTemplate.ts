import {UserSearchResult} from './User';

export type CreateTemplate = {
  templateName: string;
  templateContent: string;
  assignedUsers: UserSearchResult[];
}

export interface NotificationTemplate extends CreateTemplate {
  id: string
}
