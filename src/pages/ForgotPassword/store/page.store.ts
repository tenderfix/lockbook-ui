import { action } from 'mobx';
import { SuperPageStore } from '../../../utils/SuperPageStore';
import { IUserBase, IUserRead } from '../../../entities/User';
import { userApi } from '../api/user.api';

type WaitingForKey = 'resetPassword';

export class PageStore extends SuperPageStore<WaitingForKey> {
  constructor() {
    super({
      waitingFor: {
        resetPassword: false,
      },
    });
  }
  @action
  resetPassword = (body: Partial<IUserBase>): Promise<IUserRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: userApi.resetPassword(body),
        waitingForKey: 'resetPassword',
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
