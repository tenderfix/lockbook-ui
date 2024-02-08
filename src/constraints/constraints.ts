import * as Yup from 'yup';
import { toBooleanSchema, toStringSchema } from './toSchema';
import { ApiConstraint, ConstraintType } from './types';
import { EntityName } from '../entities/EntityName';
import { sessionStore } from '../session/session.store';

export const getStringSchema = (entity: EntityName, property: string): Yup.StringSchema => {
  return toStringSchema(getApiConstraints(entity, property));
};

export const getStringSchemaByConstraintType = (
  entity: EntityName,
  property: string,
  constraintType: ConstraintType
): Yup.StringSchema => {
  const constraints = getApiConstraints(entity, property).filter(
    (constraint) => parseConstraintType(constraint) === constraintType
  );

  return toStringSchema(constraints);
};

export const getBooleanSchema = (entity: EntityName, property: string): Yup.BooleanSchema => {
  return toBooleanSchema(getApiConstraints(entity, property));
};

export const parseConstraintType = (constraint: ApiConstraint): ConstraintType => {
  const typeSegments = constraint.type.split('\\');

  return typeSegments[typeSegments.length - 1] as ConstraintType;
};

const getApiConstraints = (entity: EntityName, property: string): ApiConstraint[] => {
  const entityConstraints = sessionStore.constraints[`App\\Entity\\${entity}`];

  if (entityConstraints === undefined) {
    return [];
  }

  if (Array.isArray(entityConstraints)) {
    return [];
  }

  const propertyConstraints = entityConstraints[property];

  if (propertyConstraints === undefined) {
    return [];
  }

  return propertyConstraints;
};
