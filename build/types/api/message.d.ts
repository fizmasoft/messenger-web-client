import { MessageType } from './message.types';
export interface IMessageTo {
    chatId: string;
    chatType: 'group' | 'private';
}
export interface IChatMessageWanted {
    type: 'user' | 'car';
    title: string;
    databaseName: string;
    sender: {
        firstName: string;
        lastName: string;
        middleName: string;
        fullName: string;
    };
    user?: {
        firstName: string;
        lastName: string;
        middleName: string;
        fullName: string;
        birthDate: string;
        image: string;
        passport: string;
        pAddress: string;
    };
    car?: {
        carImage: string;
        carNumber: string;
    };
    initiator: string;
    address: string;
    objectName: string;
    wantedDate: string;
    statya: string;
    rozType: string;
    mera: string;
    location: [number, number];
    images: string[];
    text: string;
    region: string;
}
export interface ISendChatMessageWanted {
    type: 'user' | 'car';
    title: string;
    databaseName: string;
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
    initiator: string;
    address: string;
    objectName: string;
    wantedDate: string;
    statya: string;
    rozType: string;
    mera: string;
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
