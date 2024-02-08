/**
 * based on api user entity (not all properties defined yet)
 */
import { Signature } from '@abs-safety/lock-book-web-ui';
import { ICompanyBase } from './Company';

export type LegacyRole = 'ROLE_COMPANY_OFFICE' | 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

export type Role =
  | 'ROLE_ABS_ADMIN'
  | 'ROLE_ABS_OFFICE'
  | 'ROLE_COMPANY_ADMIN'
  | 'ROLE_COMPANY_TECH';

export interface IUserBase {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  plainPassword?: string;
  repeatedPassword?: string;
  roles?: Role[];
  enabled?: boolean;
  salutation?: string;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string;
  address2?: string;
  postcode?: string;
  city?: string;
  country?: string;
  phone1?: string;
  phone2?: string;
  fax?: string;
  jobTitle?: string;
  signature?: Signature;
  acceptedTermsOfService?: boolean | null;
  acceptedTermsOfServiceDate?: Date | null;
  acceptedAbsSafetyNewsletter?: boolean | null;
  acceptedLockBookNewsletter?: boolean | null;
  receivedStartupInformation?: boolean | null;
  canUserDraw?: boolean | false;
  updatedAt?: Date | null;
  createdAt?: Date | null;
  company?: ICompanyBase;
}

//https://dev.api.auth.lock-book.com/#operation/registerCompanyCollection
export type IUserCreate = Pick<
  IUserBase,
  | 'lastName'
  | 'firstName'
  | 'phone1'
  | 'email'
  | 'plainPassword'
  | 'repeatedPassword'
  | 'username'
  | 'acceptedLockBookNewsletter'
  | 'acceptedTermsOfService'
  | 'roles'
  | 'signature'
>;

export type IUserRead = Pick<
  IUserBase,
  | 'id'
  | 'lastName'
  | 'firstName'
  | 'phone1'
  | 'email'
  | 'plainPassword'
  | 'repeatedPassword'
  | 'username'
  | 'company'
  | 'acceptedLockBookNewsletter'
  | 'roles'
  | 'signature'
>;

export type IUserWrite = Pick<
  IUserBase,
  | 'lastName'
  | 'firstName'
  | 'phone1'
  | 'email'
  | 'plainPassword'
  | 'repeatedPassword'
  | 'enabled'
  | 'acceptedLockBookNewsletter'
  | 'roles'
  | 'signature'
>;

export type IUserLogin = {
  username: string;
  password: string;
};

export interface IUserAdminister
  extends Pick<
    IUserBase,
    | 'lastName'
    | 'firstName'
    | 'phone1'
    | 'email'
    | 'plainPassword'
    | 'repeatedPassword'
    | 'username'
    | 'roles'
    | 'enabled'
    | 'jobTitle'
  > {
  id?: number;
  role?: Role;
}

export const DefaultAdministerValues: IUserAdminister = {
  role: 'ROLE_COMPANY_TECH',
  roles: ['ROLE_COMPANY_TECH'],
};
