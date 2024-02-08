import { fetchNormal } from '../../../utils/fetch';
import { IUserRead } from '../../../entities/User';

class UserApi {
  resetPassword(body: Partial<IUserRead>) {
    return fetchNormal<IUserRead>('POST', `/users/forgot-password`, body);
  }
}

export const userApi = new UserApi();
