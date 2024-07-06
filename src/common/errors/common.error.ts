import { ValidationError } from 'class-validator';
import { CODES } from '../constant/codes';
import { Replacements } from 'i18n';

export class BaseException {
  constructor(
    public readonly code: number = CODES.BASE,
    public message: { text: I18nType.I18nKey; replace?: Replacements },
    public readonly data: unknown,
    public readonly meta: unknown = {},
    public readonly success: boolean = false,
    public readonly time = new Date().toISOString(),
  ) {}

  public static Success(data: unknown, meta: unknown, code: number = CODES.BASE) {
    return new BaseException(code, { text: 'system.success' }, data, meta, true);
  }

  public static UnknownError(data?: unknown, meta: unknown = {}, code: number = CODES.BASE) {
    return new BaseException(code + 1, { text: 'errors.unknownError' }, data, meta);
  }

  public static ValidationError(
    data?: (ValidationError & { messages?: string[] })[] | I18nType.I18nKey,
    code: number = CODES.BASE,
  ) {
    if (data instanceof Array) {
      for (const d of data) {
        d.target = undefined;
        d.messages = Object.values(d.constraints);
      }
    }

    return new BaseException(code + 2, { text: 'validationError.validationError' }, data);
  }

  static AllreadyExist(data, message, code: number = CODES.BASE) {
    return new BaseException(
      code + 3,
      { text: `errors.alreadyExist`, replace: { data: message } },
      data,
    );
  }

  static NotFound(data: string, code: number = CODES.BASE) {
    return new BaseException(code + 4, { text: 'errors.notFound', replace: { data } }, null);
  }

  static InternalServerError(code: number = CODES.BASE) {
    return new BaseException(code + 5, { text: 'errors.internalServerError' }, null);
  }

  public static InvalidLoginOrPassword(code = CODES.AUTH) {
    return new BaseException(code + 6, { text: 'authAndPermission.invalidLoginOrPassword' }, null);
  }

  public static Unauthorized(data = null, code = CODES.AUTH) {
    return new BaseException(code + 7, { text: 'authAndPermission.unauthorized' }, data);
  }

  public static NotEnoughPermission(data = null, code = CODES.AUTH) {
    return new BaseException(code + 8, { text: 'authAndPermission.notEnoughPermission' }, data);
  }

  public static CannotDeleteAdmin(data = null, code = CODES.AUTH) {
    return new BaseException(code + 9, { text: 'authAndPermission.cannotDeleteAdmin' }, data);
  }
}
