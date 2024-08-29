import { MessageType } from './message.types';

export interface IMessageTo {
  chatId: string;
  chatType: 'group' | 'private';
}

export interface IChatMessageWanted {
  type: 'user' | 'car';
  title: string; // databaseName
  databaseName: string; // databaseName
  sender: {
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
  }; // * Qalqondagi fizmasoft_accounts dan olingan user
  user?: {
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    birthDate: string;
    image: string; // TODO passportnikimi aniqla
    // thumbnailImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG';
    // fullImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG';
    passport: string;
    pAddress: string; // ! rename
  };
  car?: {
    carImage: string;
    carNumber: string;
  };
  initiator: string; // * (tashabbuskor)
  address: string;
  objectName: string; // !
  wantedDate: string;
  statya: string; //! rename (modda)
  rozType: string; // ! rename (qidiruv turi)
  mera: string; // ! rename (ko'rilgan chora) reprisal
  location: [number, number];

  images: string[];
  // thumbnailImages: string[];
  // fullImages: string[];

  // isSender: boolean;
  // avatar: string;
  text: string;
  region: string;
}

export interface ISendChatMessageWanted {
  type: 'user' | 'car';
  title: string; // databaseName
  databaseName: string; // databaseName
  wantedUser?: {
    fullName: string;
    birthDate: string;
    image: string;
    passport: string;
    address: string;
  };
  pUser?: {
    fullName: string;
    birthDate: string;
    image: string;
    passport: string;
    address: string;
  };
  car?: {
    carImage: string;
    carNumber: string;
  };
  initiator: string; // * (tashabbuskor)
  address: string;
  objectName: string; // !
  wantedDate: string;
  statya: string; //! rename (modda)
  rozType: string; // ! rename (qidiruv turi)
  mera: string; // ! rename (ko'rilgan chora) reprisal
  location: [number, number];
  takenImage: string;
  fullImage: string;
  text: string;
  region: string;
}

export interface ISendMessage {
  messageType: MessageType;
  to: IMessageTo;
  text?: string;
  wanted?: ISendChatMessageWanted;
}

export interface ISendMessageToArea {
  messageType: MessageType;
  text?: string;
  wanted?: ISendChatMessageWanted;
}

export interface IMessage {
  messageType: MessageType;
  from: IMessageTo;
  to: IMessageTo;
  text?: string;
  wanted?: IChatMessageWanted;
}
