import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    // Regex to check if the password meets criteria
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
    return regex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character';
  }
}

// Decorator function to use the custom password validator
export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidPasswordConstraint
    });
  };
}
