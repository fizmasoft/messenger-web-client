import { IMessage } from './message';

export type MessageType =
  | 'text'
  | 'wanted'
  | 'audio'
  | 'photo'
  | 'gif'
  | 'video'
  | 'mediaGroup'
  | 'documentGroup'
  | 'document'
  | 'location'
  | 'liveLocation';

export interface IInputFile {
  fileId: string;
  mimeType: string; //	Optional. MIME type of the file as defined by sender
  size: number;
}

export interface InputContact {
  userId: string; //	Optional. Contact's user identifier in Messenger. This is mongoId
  phoneNumber: string; //	Contact's phone number
  firstName: string; //	Contact's first name
  lastName: string; //	Optional. Contact's last name
  vcard: any; //	Optional. Additional data about the contact in the form of a vCard
}

export interface InputPhoto extends IInputFile {
  hasSpoiler: boolean;
}

export interface InputVideo extends IInputFile {
  duration: number;
  hasSpoiler: boolean;
}

export interface InputAudio extends IInputFile {
  duration: number;
  title: string; //	Optional. Title of the audio as defined by sender or by audio tags
  fileName: string; //	Optional. Original filename as defined by sender
}

export interface InputVoice extends IInputFile {
  duration: number;
  title: string; //	Optional. Title of the audio as defined by sender or by audio tags
  fileName: string; //	Optional. Original filename as defined by sender
}

export interface InputGif extends IInputFile {
  duration: number;
  hasSpoiler: boolean;
}

export interface InputDocument extends IInputFile {
  thumbnail: string;
  fileName: string;
}

export interface InputLocation {
  latitude: number;
  longitude: number;
  hasSpoiler: boolean;
}

export interface InputLiveLocation extends InputLocation {
  duration: number;
}

type InputMedia = InputPhoto | InputVideo;
type InputMediaGroup = InputMedia[];

type InputFile =
  | InputAudio
  | InputDocument[]
  | InputGif
  | InputMediaGroup
  | InputPhoto
  | InputVideo
  | InputLocation
  | InputLiveLocation;

type Message = {
  _id: string;
  hash: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  messageType: MessageType;

  text?: string;
  contact?: InputContact;
  audio?: InputAudio;
  voice?: InputVoice;
  document?: InputDocument[];
  // sticker?: InputSticker;
  gif?: InputGif;
  mediaGroup?: InputMediaGroup;
  photo?: InputPhoto[];
  video?: InputVideo;
  location?: InputLocation;
  liveLocation?: InputLiveLocation;
  newChatMembers?: any[];
  leftChatMember?: any;

  caption?: string;

  protectContent: boolean;
  replyParameters: {
    messageId: string;
    chatId: string;
  };
  replyTo: {
    messageId: string;
    chatId: string;
  };
};

export interface IOnUpdate {
  _id: string;
  from: {
    firstName: string;
    lastName: string;
    username: string | null;
    fullName: string;
  };
  message: IMessage;
}

enum ChatACtion {
  TYPING = 'typing',
  SENDING_FILE = 'sending_file',
  SENDING_PHOTO = 'sending_photo',
  SENDING_VIDEO = 'sending_video',
}

export interface IChatAction {
  chatId: string;
  action: ChatACtion;
}

// UpdateAuthorizationState;
// UpdateUser;
// UpdateUserStatus;
// UpdateBasicGroup;
// UpdateSupergroup;
// UpdateSecretChat;
// UpdateNewChat;
// UpdateChatTitle;
// UpdateChatPhoto;
// UpdateChatLastMessage;
// UpdateChatPosition;
// UpdateChatReadInbox;
// UpdateChatReadOutbox;
// UpdateChatUnreadMentionCount;
// UpdateMessageMentionRead;
// UpdateChatReplyMarkup;
// UpdateChatDraftMessage;
// UpdateChatPermissions;
// UpdateChatNotificationSettings;
// UpdateChatDefaultDisableNotification;
// UpdateChatIsMarkedAsUnread;
// UpdateChatIsBlocked;
// UpdateChatHasScheduledMessages;
// UpdateUserFullInfo;
// UpdateBasicGroupFullInfo;
// UpdateSupergroupFullInfo;
