import { fetchNormal } from '../utils/fetch';
import { IConstraintRead } from '../entities/Constraint';
import { IUserWrite, IUserRead } from '../entities/User';

class SessionApi {
  getConstraints() {
    return;
    return fetchNormal<IConstraintRead>('GET', `/constraints`);
  }

  logout() {
    return fetchNormal<void>('GET', '/logout');
  }

  loadUser() {
    return;
    return fetchNormal<IUserRead>('GET', `/user`);
  }

  postUser(userId: number, body: IUserWrite) {
    return fetchNormal<IUserRead>('PUT', `/users/${userId}`, body);
  }

  activateAccount(token: string) {
    return fetchNormal<void>('POST', `/activate/${token}`);
  }
}

export const sessionApi = new SessionApi();
