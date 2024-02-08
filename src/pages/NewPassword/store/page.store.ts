import { action } from 'mobx';
import { SuperPageStore } from '../../../utils/SuperPageStore';
import { IUserBase, IUserRead } from '../../../entities/User';
import { userApi } from '../api/user.api';

type WaitingForKey = 'newPassword';

export class PageStore extends SuperPageStore<WaitingForKey> {
  constructor() {
    super({
      waitingFor: {
        newPassword: false,
      },
    });
  }

  @action
  newPassword = (body: Partial<IUserBase>): Promise<IUserRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: userApi.newPassword(body),
        waitingForKey: 'newPassword',
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
