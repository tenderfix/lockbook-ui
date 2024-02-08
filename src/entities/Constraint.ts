// related entities
export interface IConstraintBase {
  message?: string;
  allowNull?: boolean;
  /** ignore. Seems always null */
  normalizer?: null;
  /** ignore. Seems always null */
  payload?: null;
  htmlPattern?: string;
  [key: string]: unknown;
  groups: string[];
}

export interface ApiConstraint {
  type: string;
  options: IConstraintBase;
}

export type ApiEntityConstraints =
  | {
      [key: string]: ApiConstraint[] | undefined;
    }
  | unknown[];

/** this is what we get from API by GET /constraints?lang=... */
export type IConstraintRead = { [key: string]: ApiEntityConstraints | undefined };
