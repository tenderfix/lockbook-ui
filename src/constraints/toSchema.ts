import { ApiConstraint } from './types';
import * as Yup from 'yup';
import { parseConstraintType } from './constraints';

export function toStringSchema(constraints: ApiConstraint[]): Yup.StringSchema {
  let schema = Yup.string();

  if (constraints.length === 0) {
    return schema;
  }

  constraints.forEach((constraint) => {
    const constraintType = parseConstraintType(constraint);

    switch (constraintType) {
      case 'NotBlank':
        schema = schema.required(constraint.options.message ?? 'This value should not be blank.');
        break;
      case 'Email':
        schema = schema.email(
          constraint.options.message ?? 'This value is not a valid email address.'
        );
        break;
      case 'Regex':
        schema = schema.matches(
          new RegExp(
            constraint.options.pattern !== undefined
              ? constraint.options.pattern.substring(1, constraint.options.pattern.length - 1)
              : '.*'
          ),
          constraint.options.message ?? 'This value is not valid.'
        );
        break;
      default:
        break;
    }
  });

  return schema;
}

export function toBooleanSchema(constraints: ApiConstraint[]): Yup.BooleanSchema {
  let schema = Yup.boolean();

  if (constraints.length === 0) {
    return schema;
  }

  constraints.forEach((constraint) => {
    const constraintType = parseConstraintType(constraint);

    switch (constraintType) {
      case 'IsTrue':
        schema = schema.oneOf([true], constraint.options.message);
        break;
      default:
        break;
    }
  });

  return schema;
}
