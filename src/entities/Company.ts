/**
 * based on https://dev.api.auth.lock-book.com/#operation/registerCompanyCollection
 */

// related entities
export interface ICompanyBase {
  id: number;
  name: string | null;
  address1: string | null;
  address2: string | null;
  postcode: string | null;
  city: string | null;
  country: string | null;
  managerSalutation: string | null;
  managerFirstName: string | null;
  managerLastName: string | null;
  email?: string;
  phone1?: string;
  phone2: string | null;
  fax: string | null;
  displayAssemblerInformation: boolean | null;
  updatedAt?: Date | null;
  createdAt?: Date | null;
  companyId: number;
  imageUrl?: string | null;
  uploadUrl: string;
  imageFile: File | Blob | string;
  imageFilename: string;
  fileSize: string;
  industry: string;
}

export type ICompanyCreate = Pick<
  ICompanyBase,
  'name' | 'address1' | 'address2' | 'postcode' | 'city' | 'country' | 'industry'
>;

export type ICompanyRead = Pick<
  ICompanyBase,
  | 'id'
  | 'name'
  | 'address1'
  | 'address2'
  | 'postcode'
  | 'city'
  | 'country'
  | 'imageFile'
  | 'imageUrl'
  | 'imageFilename'
  | 'industry'
  // | 'managerFirstName'
  // | 'managerLastName'
  // | 'phone1'
  // | 'phone2'
  // | 'email'
  // | 'displayAssemblerInformation'
>;

export type ICompanyWrite = Pick<
  ICompanyBase,
  'name' | 'address1' | 'address2' | 'postcode' | 'city' | 'country' | 'industry'
  // | 'managerFirstName'
  // | 'managerLastName'
  // | 'email'
  // | 'phone1'
  // | 'phone2'
  // | 'displayAssemblerInformation'
>;

export type ICompanyLogoWrite = Pick<ICompanyBase, 'imageFile'>;

export type ICompanyLogoUpdate = Partial<Pick<ICompanyBase, 'imageFilename'>>;
