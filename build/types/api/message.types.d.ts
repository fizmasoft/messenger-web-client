import { IMessage } from './message';
export type MessageType = 'text' | 'wanted' | 'audio' | 'photo' | 'gif' | 'video' | 'mediaGroup' | 'documentGroup' | 'document' | 'location' | 'liveLocation';
export interface IInputFile {
    fileId: string;
    mimeType: string;
    size: number;
}
export interface InputContact {
    userId: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    vcard: any;
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
    title: string;
    fileName: string;
}
export interface InputVoice extends IInputFile {
    duration: number;
    title: string;
    fileName: string;
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
declare enum ChatACtion {
    TYPING = "typing",
    SENDING_FILE = "sending_file",
    SENDING_PHOTO = "sending_photo",
    SENDING_VIDEO = "sending_video"
}
export interface IChatAction {
    chatId: string;
    action: ChatACtion;
}
export {};
