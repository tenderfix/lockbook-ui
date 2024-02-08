import {
  ICompanyBase,
  ICompanyWrite,
  ICompanyRead,
  ICompanyLogoWrite,
} from '../../../entities/Company';
import { IUserBase, IUserWrite } from '../../../entities/User';
import { fetchNormal, fetchUpload } from '../../../utils/fetch';

class AccountApi {
  postCompany(companyId: ICompanyBase['id'], body: ICompanyWrite) {
    return fetchNormal<ICompanyRead>('PUT', `/companies/${companyId}`, body);
  }

  postCompanyLogo(companyId: ICompanyBase['id'], body: ICompanyLogoWrite) {
    const form = new FormData();
    form.append('imageFile', body.imageFile);
    return fetchUpload<ICompanyRead>('POST', `/companies/${companyId}/upload-logo`, form);
  }

  removeCompanyLogo(companyId: ICompanyBase['id']) {
    return fetchNormal<ICompanyRead>('DELETE', `/companies/${companyId}/remove-logo`);
  }

  loadCompany(companyId: ICompanyBase['id']) {
    return fetchNormal<ICompanyRead>('GET', `/companies/${companyId}`);
  }

  loadCompanyMembers(companyId: ICompanyBase['id']) {
    return fetchNormal<IUserBase[]>('GET', `/companies/${companyId}/users`);
  }

  loadUser(userId: IUserBase['id']) {
    return fetchNormal<IUserBase>('GET', `/users/${userId}`);
  }

  createCompanyMember(companyId: ICompanyBase['id'], body: IUserWrite) {
    return fetchNormal<IUserBase>('POST', `/companies/${companyId}/users`, body);
  }
}

export const accountApi = new AccountApi();
