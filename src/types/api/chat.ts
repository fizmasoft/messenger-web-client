export type ChatType = 'private' | 'group' | 'channel' | 'bot';

export interface IChat {
  _id: string;
  title: string;
  photo: string;
  lastMessage: string;
  lastMessageCreatedAt: string;
  lastMessageIsRead: boolean;
  senderIsMe: boolean;
  isOnline: boolean;
  unreadMessageCount: number;
}
