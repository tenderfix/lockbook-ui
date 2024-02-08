import { fetchNormal } from '../../../utils/fetch';
import { IUserRead } from '../../../entities/User';

class UserApi {
  resendAccountActivation(body: Partial<IUserRead>) {
    return fetchNormal<IUserRead>('POST', `/users/resend-account-activation`, body);
  }
}

export const userApi = new UserApi();
