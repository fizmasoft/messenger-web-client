declare namespace ApiMessageManagement {
  interface IMessageTo {
    chatId: string;
    chatType: 'group' | 'private';
  }

  interface IChatMessageWanted {
    type: 'user' | 'car';
    title: string; // databaseName
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
    fullImages: string[];

    // isSender: boolean;
    // avatar: string;
    text: string;
    region: string;
  }

  interface ISendMessage {
    messageType: Messenger.MessageType;
    to: IMessageTo;
    text?: string;
    wanted?: IChatMessageWanted;
  }

  interface IMessage {
    messageType: Messenger.MessageType;
    from: IMessageTo;
    to: IMessageTo;
    text?: string;
    wanted?: IChatMessageWanted;
  }
}
