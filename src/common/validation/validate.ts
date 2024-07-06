import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BaseException } from '../errors/common.error';

export const validateIt = async <T>(data, classType: ClassConstructor<T>, groups: string[]): Promise<T> => {
  if (!data) {
    throw BaseException.ValidationError('Request body should be object');
  }

  const classData = plainToClass(classType, data as T, {
    excludeExtraneousValues: false,
  });

  const errors = await validate(classData as object, { groups, whitelist: true });

  if (!errors || errors.length === 0) return classData;

  throw BaseException.ValidationError(errors);
};
