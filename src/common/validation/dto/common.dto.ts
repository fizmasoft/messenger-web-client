import { IsArray, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import type { Types } from 'mongoose';

export class BaseDtoGroup {
  static readonly CREATE = 'create';
  static readonly UPDATE = 'update';
  static readonly DELETE = 'delete';
  static readonly GET_BY_ID = 'getById';
  static readonly PAGINATION = 'pagination';
}

export class BaseDto {
  @IsArray({
    groups: [BaseDtoGroup.DELETE],
    each: true,
  })
  @IsMongoId({
    groups: [BaseDtoGroup.DELETE],
  })
  ids?: string[];

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      groups: [
        BaseDtoGroup.UPDATE,
        BaseDtoGroup.DELETE,
        BaseDtoGroup.GET_BY_ID,
        BaseDtoGroup.PAGINATION,
      ],
    },
  )
  _id: string | Types.ObjectId;

  @IsOptional({ groups: [BaseDtoGroup.CREATE] })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      groups: [BaseDtoGroup.CREATE],
    },
  )
  createdBy?: string | Types.ObjectId;

  @IsOptional({ groups: [BaseDtoGroup.DELETE] })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      groups: [BaseDtoGroup.DELETE],
    },
  )
  deletedBy?: string | Types.ObjectId;

  deletedAt?: Date | string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export class GetPagingDto {}
