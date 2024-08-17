import type { Types } from 'mongoose';
export declare class BaseDtoGroup {
    static readonly CREATE = "create";
    static readonly UPDATE = "update";
    static readonly DELETE = "delete";
    static readonly GET_BY_ID = "getById";
    static readonly PAGINATION = "pagination";
}
export declare class BaseDto {
    ids?: string[];
    _id: string | Types.ObjectId;
    createdBy?: string | Types.ObjectId;
    deletedBy?: string | Types.ObjectId;
    deletedAt?: Date | string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
export declare class GetPagingDto {
}
