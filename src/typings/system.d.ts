declare namespace I18nType {
  type LangType = 'Uz-Latin' | 'Uz-Cyrl' | 'ru';

  type Schema = {
    system: {
      title: string;
      success: string;
    };

    authAndPermission: {
      invalidLoginOrPassword: string;
      unauthorized: string;
      notEnoughPermission: string;
      cannotDeleteYourSelf: string;
      cannotDeleteAdmin: string;
    };

    errors: {
      unknownError: string;
      alreadyExist: string;
      internalServerError: string;
      notFound: string;
    };

    validationError: {
      validationError: string;
      required: string;
      bodyShouldBeObject: string;
      invalidUsername: string;
      invalidPhoneNumber: string;
      invalidPassword: string;
      invalidPasswordConfirmation: string;
    };

    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    dinner: string;
  };

  type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, unknown>
      ? `${K}.${GetI18nKey<T[K]>}`
      : K
    : never;

  type I18nKey = GetI18nKey<Schema>;
}
