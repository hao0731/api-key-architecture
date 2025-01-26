import { registerDecorator, ValidationOptions } from 'class-validator';
import { checkRoleNameFormat } from '../utils';

export function IsRoleName(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      name: 'isRoleName',
      target: object.constructor,
      propertyName: propertyName.toString(),
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value) => {
          if (typeof value !== 'string') {
            return false;
          }
          return checkRoleNameFormat(value);
        },
        defaultMessage: (args) => `${args?.value} is not a valid role name`,
      },
    });
  };
}
