export interface IConstraintViolationResponse {
  title: string;
  detail: string;
  violations: Array<Violation>;
}

export interface INotFoundResponse {
  title: string;
  detail: string;
}

type Violation = {
  propertyPath: string;
  message: string;
};

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Forbidden';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public payload: INotFoundResponse) {
    super(message);
    this.name = 'NotFound';
  }
}

export class ConstraintViolationError extends Error {
  constructor(message: string, public payload: IConstraintViolationResponse) {
    super(message);
    this.name = 'ConstraintViolation';
  }
}
