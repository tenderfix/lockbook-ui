import { ICompanyRead, ICompanyCreate } from '../../../entities/Company';
import { fetchNormal } from '../../../utils/fetch';

class CompanyApi {
  postCompany(body: Partial<ICompanyCreate>) {
    return fetchNormal<ICompanyRead>('POST', `/companies`, body);
  }

  getCompanyByName(body: Partial<ICompanyCreate>) {
    return fetchNormal<ICompanyRead>(
      'GET',
      `/companies/find`,
      undefined,
      `name=${body.name}&postcode=${body.postcode}&address1=${body.address1}`
    );
  }
}

export const companyApi = new CompanyApi();
