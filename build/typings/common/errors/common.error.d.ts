import { ValidationError } from 'class-validator';
import { Replacements } from 'i18n';
export declare class BaseException {
    readonly code: number;
    message: {
        text: I18nType.I18nKey;
        replace?: Replacements;
    };
    readonly data: unknown;
    readonly meta: unknown;
    readonly success: boolean;
    readonly time: string;
    constructor(code: number, message: {
        text: I18nType.I18nKey;
        replace?: Replacements;
    }, data: unknown, meta?: unknown, success?: boolean, time?: string);
    static Success(data: unknown, meta: unknown, code?: number): BaseException;
    static UnknownError(data?: unknown, meta?: unknown, code?: number): BaseException;
    static ValidationError(data?: (ValidationError & {
        messages?: string[];
    })[] | I18nType.I18nKey, code?: number): BaseException;
    static AllreadyExist(data: any, message: any, code?: number): BaseException;
    static NotFound(data: string, code?: number): BaseException;
    static InternalServerError(code?: number): BaseException;
    static InvalidLoginOrPassword(code?: any): BaseException;
    static Unauthorized(data?: any, code?: any): BaseException;
    static NotEnoughPermission(data?: any, code?: any): BaseException;
    static CannotDeleteAdmin(data?: any, code?: any): BaseException;
}
