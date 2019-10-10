import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsPasswordValidConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const arrayPassword = password.split("");
    const errors = [];
    for (let i = 0; i < arrayPassword.length; i++) {
      errors.push(
        (/[A-Z]/.test(arrayPassword[i]) ? "U" : "") +
          (/\d/.test(arrayPassword[i]) ? "N" : "") || 0
      );
    }
    if (errors.indexOf("U") === -1) {
      return false;
    } else if (errors.indexOf("N") === -1) {
      return false;
    } else {
      return true;
    }
  }
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordValidConstraint
    });
  };
}
