interface ApiConstraintOptions {
  /** seems always defined, besides on Files */
  message?: string;
  allowNull?: boolean;
  /** ignore. Seems always null */
  normalizer?: null;
  /** ignore. Seems always null */
  payload?: null;
  pattern?: string;
  htmlPattern?: string;
  [key: string]: unknown;
  groups: string[];
}

export interface ApiConstraint {
  type: string;
  options: ApiConstraintOptions;
}

export type ConstraintType = 'NotBlank' | 'Email' | 'Regex' | 'IsTrue';
