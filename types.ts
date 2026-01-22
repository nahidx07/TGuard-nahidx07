
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  startedAt: string;
}

export interface ModerationLog {
  id: string;
  userId: number;
  username?: string;
  action: 'DELETED' | 'WARNING' | 'BROADCAST';
  reason?: string;
  timestamp: string;
  chatId: number;
}

export enum BotStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface ChatVerification {
  type: 'group' | 'supergroup' | 'channel' | 'private';
  id: number;
  title?: string;
  username?: string;
}
