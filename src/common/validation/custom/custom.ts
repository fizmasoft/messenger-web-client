/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'MyCustom', async: false })
export class IsNimadirValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // value
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid value: ${args.value}`;
  }
}
