import { fetchNormal } from '../../../utils/fetch';
import { IUserRead } from '../../../entities/User';

class UserApi {
  newPassword(body: Partial<IUserRead>) {
    return fetchNormal<IUserRead>('POST', `/users/new-password`, body);
  }
}

export const userApi = new UserApi();
