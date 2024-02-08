import { action } from 'mobx';
import { SuperPageStore } from '../../../utils/SuperPageStore';
import { IUserBase, IUserRead } from '../../../entities/User';
import { userApi } from '../api/user.api';

type WaitingForKey = 'resendAccountActivation';

export class PageStore extends SuperPageStore<WaitingForKey> {
  constructor() {
    super({
      waitingFor: {
        resendAccountActivation: false,
      },
    });
  }
  @action
  resendAccountActivation = (body: Partial<IUserBase>): Promise<IUserRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: userApi.resendAccountActivation(body),
        waitingForKey: 'resendAccountActivation',
        then: (response) => {
          resolve(response);
        },
        catch: (err) => {
          reject(err);
        },
      });
    });
  };
}

export const pageStore = new PageStore();
