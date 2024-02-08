import { fetchNormal } from '../../../utils/fetch';
import { LoginFormValues } from '../LoginForm';
import { ILoginResponse } from '../../../entities/Login';

class LoginApi {
  postLogin = async (values: LoginFormValues) => {
    return await fetchNormal<ILoginResponse>('POST', '/login', {
      username: values.username.trim(),
      password: values.password.trim(),
    });
  };
}

export const loginApi = new LoginApi();
