import { action, computed, observable } from 'mobx';
import { IConstraintRead } from '../entities/Constraint';
import { IUserRead, IUserWrite, LegacyRole, Role } from '../entities/User';
import { loginApi } from '../pages/Login/api/login.api';
import { LoginFormValues } from '../pages/Login/LoginForm';
import { SuperPageStore } from '../utils/SuperPageStore';
import { sessionApi } from './session.api';
import { ILoginResponse } from '../entities/Login';
import { legalApi } from '../pages/Login/api/legal.api';
import { DEFAULT_LOCALE, Locale, Locales } from '../i18n/locales';

type WaitingForKey =
  | 'loadConstraints'
  | 'login'
  | 'logout'
  | 'loadUser'
  | 'updateUser'
  | 'hasAcceptedLatestLegalDocuments'
  | 'acceptLatestLegalDocuments';

class SessionStore extends SuperPageStore<WaitingForKey> {
  @observable
  constraints: IConstraintRead = {};

  @observable
  private _user?: IUserRead;

  @observable
  locale: Locale = DEFAULT_LOCALE;

  @observable
  isLoggedIn?: boolean = undefined;

  @observable
  hasAcceptedLegal?: boolean = undefined;

  constructor() {
    super({
      waitingFor: {
        loadConstraints: false,
        logout: false,
        login: false,
        loadUser: false,
        updateUser: false,
        hasAcceptedLatestLegalDocuments: false,
        acceptLatestLegalDocuments: false,
      },
    });
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  @computed
  get isAdmin(): boolean {
    const adminRoles: (Role | LegacyRole)[] = [
      'ROLE_ABS_ADMIN',
      'ROLE_COMPANY_ADMIN',
      'ROLE_SUPER_ADMIN',
    ];
    // user has at least one adminRole
    return this.user?.roles?.some((role) => adminRoles.includes(role)) ?? false;
  }

  @computed
  get isInitialized(): boolean {
    if (this.isLoggedIn === false) {
      return true;
    }

    return this.isLoggedIn !== undefined && this.hasAcceptedLegal !== undefined;
  }

  @computed
  get isInitializing(): boolean {
    return (
      this.waitingFor.loadUser === true || this.waitingFor.hasAcceptedLatestLegalDocuments === true
    );
  }

  @action
  applyLocale = (locale: Locale): void => {
    if (Locales.find((currentLocale) => currentLocale === locale) !== undefined) {
      this.locale = locale;
    } else {
      this.locale = DEFAULT_LOCALE;
    }
    document.documentElement.lang = this.locale;
    this.loadConstraints();
  };

  @action
  loadConstraints = (): void => {
    this.sendRequest({
      request: sessionApi.getConstraints(),
      waitingForKey: 'loadConstraints',
      then: (response) => {
        this.constraints = response;
      },
    });
  };

  @action
  logout = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: sessionApi.logout(),
        waitingForKey: 'logout',
        then: () => {
          this.isLoggedIn = false;
          this.user = undefined;
          resolve();
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  login = (values: LoginFormValues): Promise<ILoginResponse> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: loginApi.postLogin(values),
        waitingForKey: 'login',
        then: (response) => {
          this.isLoggedIn = true;
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  updateUser = (body: IUserWrite, userId: number): Promise<IUserRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: sessionApi.postUser(userId, body),
        waitingForKey: 'updateUser',
        then: (response) => {
          if (userId === this.user?.id) {
            this.user = { ...this.user, ...response };
          }
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  hasAcceptedLatestLegalDocuments = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: legalApi.hasAcceptedLatestLegalDocuments(),
        waitingForKey: 'hasAcceptedLatestLegalDocuments',
        then: (response) => {
          this.hasAcceptedLegal = response;
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  acceptLatestLegalDocuments = (): Promise<Response> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: legalApi.acceptLatestLegalDocuments(),
        waitingForKey: 'acceptLatestLegalDocuments',
        then: (response) => {
          this.hasAcceptedLegal = true;
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  };

  @action
  loadUser = (): Promise<IUserRead> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: sessionApi.loadUser(),
        waitingForKey: 'loadUser',
        then: (response: IUserRead) => {
          this.isLoggedIn = true;
          this.user = response;
          resolve(response);
        },
        catch: (error) => {
          this.isLoggedIn = false;
          this.user = undefined;
          reject(error);
        },
      });
    });
  };
}

export const sessionStore = new SessionStore();
