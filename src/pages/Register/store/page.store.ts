import { observable, action } from 'mobx';
import { SuperPageStore } from '../../../utils/SuperPageStore';
import { ICompanyRead, ICompanyCreate } from '../../../entities/Company';
import { companyApi } from '../api/company.api';
import { sessionApi } from '../../../session/session.api';

type WaitingForKey = 'createCompany' | 'getCompanyByName' | 'activateAccount';

export class PageStore extends SuperPageStore<WaitingForKey> {
  @observable
  companyId?: number;

  @observable
  companies: ICompanyRead[] = [];

  constructor() {
    super({
      waitingFor: {
        createCompany: false,
        getCompanyByName: false,
        activateAccount: false,
      },
    });
  }

  @action
  setCompanyId = (companyId: number): void => {
    this.companyId = companyId;
  };

  @action
  createCompany = (body: Partial<ICompanyCreate>): Promise<ICompanyRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: companyApi.postCompany(body),
        waitingForKey: 'createCompany',
        then: (response) => {
          this.companies = [response, ...this.companies];
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  getCompanyByName = (body: Partial<ICompanyCreate>): Promise<ICompanyRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: companyApi.getCompanyByName(body),
        waitingForKey: 'getCompanyByName',
        then: (response) => {
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  activateAccount = (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: sessionApi.activateAccount(token),
        waitingForKey: 'activateAccount',
        then: (response) => {
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };
}

export const pageStore = new PageStore();
