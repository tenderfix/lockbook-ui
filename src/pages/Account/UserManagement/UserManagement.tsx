import {
  Button,
  ButtonClose,
  Card,
  GridColumns,
  IconPlus,
  ListSortable,
  Modal,
  SearchBar,
  SideModal,
  SideModalColumn,
} from '@abs-safety/lock-book-web-ui';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { DefaultAdministerValues, IUserAdminister, IUserBase } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import { layoutValues } from '../../../templates/layoutValues';
import { pageStore } from '../store/page.store';
import CreateUser from './CreateUser';
import EditUser from './EditUser';

const ColStyle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const S = {
  Header: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  CardWrapper: styled.div`
    cursor: pointer;
    .companyMemberCard {
      align-items: center;
      display: flex;
      > div {
        width: 100%;
      }
    }
  `,
  Col: styled(ColStyle)``,
  BoldCol: styled(ColStyle)`
    font-weight: 600;
  `,
  Button: styled(Button)`
    margin: 30px 0;
  `,
  SearchBarFix: styled.div`
    width: 330px;
    input ~ div {
      position: absolute;
      top: 0;
      line-height: 58px;
      transform: translateY(0);
      right: 20px;
      cursor: pointer;
    }
  `,
  NotFound: styled.p`
    text-align: center;
    font-weight: 600;
    line-height: 4;
  `,
  Column: styled.div`
    width: ${750 - 60}px /* padding: 60px in parent Node */;
  `,
  ButtonClose: styled.div`
    position: absolute;
    right: ${30 / 16}rem;
    top: ${30 / 16}rem;
  `,
};

export interface ProfileFormProps extends FormikProps<IUserAdminister> {
  /** show that updating the Profile was successful */
  submitSuccess?: boolean;
  error?: ConstraintViolationError | false;
  onClose?: void;
  enabled?: boolean;
}

const filterMembers = (members: IUserBase[] = [], searchValue = '') => {
  if (searchValue === '' || members.length === 0) {
    return [...pageStore.members].filter((member) => member.id !== sessionStore.user?.id);
  }

  const svList = searchValue.split(/[^A-Za-z0-9-_]/).map((item) => item.toLowerCase());
  return members.filter((member: IUserBase) => {
    if (member.id === sessionStore.user?.id) return;

    const memberList = Object.values(member).join(' ').toLowerCase();
    for (let i = 0; i < svList.length; i++) {
      if (memberList.indexOf(svList[i]) < 0) {
        return false;
      }
    }
    return true;
  });
};

const UserManagement: FunctionComponent = () => {
  const { t } = useTranslation();

  // some stuff for navigating / routing
  const { path, url } = useRouteMatch();
  const [userDefaultProps] = useState<IUserAdminister>(DefaultAdministerValues);
  const [searchValue, setSearchValue] = useState('');
  const history = useHistory();

  const newUser = () => {
    pageStore.setCurrentMember(userDefaultProps);
  };

  const resetModal = () => {
    pageStore.setCurrentMember(undefined);
  };

  const filterList = (value = '') => {
    setSearchValue(value);
  };

  useEffect(() => {
    const companyId = sessionStore.user?.company?.id;

    if (companyId === undefined) {
      return;
    }

    pageStore.setCurrentMember();
    pageStore.loadCompanyMembers(companyId);
  }, [sessionStore.user?.company?.id]);

  useEffect(() => {
    if (pageStore.currentMember !== undefined) {
      if (pageStore.currentMember.id !== undefined) {
        return history.push(`${url}/edit`);
      }
      return history.push(`${url}/new`);
    }

    history.push(`${url}`);
  }, [pageStore.currentMember]);

  return (
    <>
      <S.Header>
        <div>
          <h3>{t('profile.user_management.title')}</h3>
          <S.Button onClick={newUser} type={'button'} icon={<IconPlus color={'currentColor'} />}>
            {t('company.add_user')}
          </S.Button>
        </div>
        <S.SearchBarFix>
          <SearchBar placeholder={t('company.search_user')} onChange={filterList} />
        </S.SearchBarFix>
      </S.Header>
      <ListSortable
        headerStyle={{ padding: '10px' }}
        listStyle={{ display: 'grid', gridGap: '5px' }}
        columnSizes={{ xs: [2, 2, 5, 2, 1] }}
        items={filterMembers(pageStore.members, searchValue)}
        columns={[
          { title: t('form.firstname'), sortProperty: 'firstName' },
          { title: t('form.lastname'), sortProperty: 'lastName' },
          { title: t('form.email'), sortProperty: 'email' },
          { title: t('roles.title'), sortProperty: 'roles' },
          { title: t('user.state'), sortProperty: 'enabled' },
        ]}
      >
        {(listSorted: IUserBase[]) =>
          listSorted.length === 0 && searchValue !== '' ? (
            <S.NotFound>{t('user.search_not_found')}</S.NotFound>
          ) : (
            listSorted.map((person, i) => (
              <S.CardWrapper
                key={`${i}_${person.id}`}
                onClick={() => pageStore.setCurrentMember(person)}
              >
                <Card className={'companyMemberCard'}>
                  <GridColumns columnSizes={{ xs: [2, 2, 5, 2, 1] }}>
                    <S.BoldCol>{person.firstName}</S.BoldCol>
                    <S.BoldCol>{person.lastName}</S.BoldCol>
                    <S.Col>{person.email}</S.Col>
                    <S.Col>{t(`roles.${person.roles}`)}</S.Col>
                    <S.Col>
                      {person.enabled === true ? t('user.active') : t('user.deactivated')}
                    </S.Col>
                  </GridColumns>
                </Card>
              </S.CardWrapper>
            ))
          )
        }
      </ListSortable>
      {/* SubRoutes (SideModals)... */}
      <Switch>
        <Route path={`${path}/edit`}>
          <SideModal
            isOpen
            onCloseClick={resetModal}
            style={{
              display: 'block',
              height: `calc(100% - ${layoutValues.header.height}px)`,
              top: `${layoutValues.header.height}px`,
            }}
          >
            <S.ButtonClose>
              <ButtonClose onClick={resetModal} />
            </S.ButtonClose>
            <SideModalColumn>
              <S.Column>
                {pageStore.currentMember !== undefined ? (
                  <EditUser {...pageStore.currentMember} />
                ) : (
                  ''
                )}
              </S.Column>
            </SideModalColumn>
          </SideModal>
        </Route>
        <Route path={`${path}/new`}>
          <Modal size={'lg'} isOpen onCloseClick={resetModal}>
            <S.ButtonClose>
              <ButtonClose onClick={resetModal} />
            </S.ButtonClose>
            {<CreateUser {...userDefaultProps} />}
          </Modal>
        </Route>
      </Switch>
    </>
  );
};

export default observer(UserManagement);
