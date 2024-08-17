import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsNimadirValidator implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
