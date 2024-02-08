import { action, observable } from 'mobx';
import { ICompanyBase, ICompanyRead, ICompanyWrite } from '../../../entities/Company';
import { IUserAdminister, IUserBase, IUserRead, IUserWrite } from '../../../entities/User';
import { sessionApi } from '../../../session/session.api';
import { SuperPageStore } from '../../../utils/SuperPageStore';
import { accountApi } from '../api/account.api';
import { RoleMapper } from '../../../entities/RoleMapper';

type WaitingForKey =
  | 'updateCompany'
  | 'loadCompany'
  | 'updateCompanyLogo'
  | 'updateUser'
  | 'loadUser'
  | 'createUser';

class PageStore extends SuperPageStore<WaitingForKey> {
  @observable
  company?: ICompanyRead;
  @observable
  private _companyMembers: IUserBase[] = [];
  private _roleMapper = new RoleMapper();

  constructor() {
    super({
      waitingFor: {
        updateCompany: false,
        loadCompany: false,
        updateCompanyLogo: false,
        loadUser: false,
        createUser: false,
        updateUser: false,
      },
    });
  }

  @observable
  private _currentMember?: IUserAdminister;

  get currentMember(): IUserAdminister | undefined {
    return this._currentMember;
  }

  set currentMember(currentMember: IUserAdminister | undefined) {
    const role = currentMember?.role ?? false;
    const roles = currentMember?.roles ?? [];

    if (currentMember !== undefined && role === false && roles.length > 0) {
      currentMember.role = this._roleMapper.getRoleByLegacyRole(roles[0]);
    }

    this._currentMember = currentMember;
  }

  get members(): IUserBase[] {
    return this._companyMembers;
  }

  set members(members: IUserBase[]) {
    this._companyMembers = members;
  }

  mapMembersRole(member: IUserBase) {
    member.roles = member.roles ?? [];

    if (member.roles.length > 0) {
      member.roles[0] = this._roleMapper.getRoleByLegacyRole(member.roles[0]);
    }

    return member;
  }

  @action
  setCurrentMember(currentMember?: IUserAdminister) {
    this.currentMember = currentMember;
  }

  @action
  async updateUser(body: IUserWrite, userId: number): Promise<IUserRead | undefined> {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: sessionApi.postUser(userId, body),
        waitingForKey: 'updateUser',
        then: (response) => {
          this.currentMember = this.mapMembersRole({ ...response });
          const members = this.members;
          for (let i = 0; i < members.length; i++) {
            if (members[i].id === response.id) {
              members[i] = response;
              break;
            }
          }

          this.members = members.map((member) => this.mapMembersRole(member));
          resolve(response);
        },
        catch: (err) => {
          reject(err);
        },
      });
    });
  }

  @action
  async createCompanyMember(
    companyId: ICompanyBase['id'],
    body: IUserWrite
  ): Promise<IUserBase | undefined> {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.createCompanyMember(companyId, body),
        waitingForKey: 'createUser',
        then: (response) => {
          this.members = [...this.members, response].map((member) => this.mapMembersRole(member));
          resolve(this.mapMembersRole(response));
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  }

  @action
  async loadCompanyMembers(companyId: ICompanyBase['id']): Promise<IUserBase[]> {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.loadCompanyMembers(companyId),
        waitingForKey: 'loadCompany',
        then: (response: IUserBase[]) => {
          this.members = response.map((member) => this.mapMembersRole(member));
          resolve(this.members);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  }

  @action
  async loadCompany(companyId: ICompanyBase['id']): Promise<IUserRead> {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.loadCompany(companyId),
        waitingForKey: 'loadCompany',
        then: (response: ICompanyRead) => {
          this.company = response;
          resolve(response);
        },
        catch: (error) => {
          reject(error);
        },
      });
    });
  }

  @action
  updateCompany = (
    body: ICompanyWrite,
    companyId: ICompanyBase['id']
  ): Promise<ICompanyRead | undefined> => {
    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.postCompany(companyId, body),
        waitingForKey: 'updateCompany',
        then: (response) => {
          this.company = response;
          resolve(response);
        },
        catch: (err) => {
          reject(err);
        },
      });
    });
  };

  @action
  uploadFile = (companyId: ICompanyBase['id'], file: File): Promise<ICompanyRead | undefined> => {
    if (this.company === undefined) {
      throw Error('Cannot upload file.');
    }

    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.postCompanyLogo(companyId, {
          imageFile: file,
        }),
        waitingForKey: 'updateCompany',
        then: (response) => {
          this.company = response;
          resolve(response);
        },
        catch: (err) => {
          reject(err);
        },
      });
    });
  };

  @action
  removeFile = (companyId: ICompanyBase['id']): Promise<ICompanyRead | undefined> => {
    if (this.company === undefined) {
      throw Error('Cannot delete file.');
    }

    return new Promise((resolve, reject) => {
      this.sendRequest({
        request: accountApi.removeCompanyLogo(companyId),
        waitingForKey: 'updateCompany',
        then: (response) => {
          if (this.company !== undefined) this.company.imageUrl = '';
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
