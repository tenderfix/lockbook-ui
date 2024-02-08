import { MainNavigation } from '@abs-safety/lock-book-web-ui';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import AdminRoute from '../../routing/AdminRoute';
import { sessionStore } from '../../session/session.store';
import MainPage from '../../components/MainPage';
import ChangePassword from './ChangePassword/ChangePassword';
import Company from './Company/Company';
import Profile from './Profile/Profile';
import UserManagement from './UserManagement/UserManagement';
import Signature from './Signature/Signature';

// Styled Components
const S = {
  Component: styled.div``,
  Wrapper: styled.div`
    display: flex;
  `,
  MainNavigationWrapper: styled.div`
    flex: 0 0 30%;
  `,
  ContentWrapper: styled.div`
    flex: 1 0 0;
  `,
};

enum ItemId {
  ITEM_PROFILE = 'profile',
  ITEM_CHANGE_PASSWORD = 'changePassword',
  ITEM_SIGNATURE = 'signature',
  ITEM_COMPANY = 'company',
  ITEM_USER_MANAGEMENT = 'userManagement',
}

const Account: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const getActiveId = (): ItemId => {
    if (`${match.path}/change-password` === location.pathname) {
      return ItemId.ITEM_CHANGE_PASSWORD;
    }

    if (`${match.path}/signature` === location.pathname) {
      return ItemId.ITEM_SIGNATURE;
    }

    if (`${match.path}/company` === location.pathname) {
      return ItemId.ITEM_COMPANY;
    }

    if (location.pathname.indexOf(`${match.path}/user-management`) === 0) {
      return ItemId.ITEM_USER_MANAGEMENT;
    }

    return ItemId.ITEM_PROFILE;
  };

  return (
    <MainPage title={t('profile.my_account')}>
      <S.Wrapper>
        <S.MainNavigationWrapper>
          <MainNavigation
            small
            vertical
            key={sessionStore.isAdmin ? 'admin-nav' : 'default-nav'}
            activeId={getActiveId()}
            items={[
              {
                id: ItemId.ITEM_PROFILE,
                headline: t('profile.general'),
                text: t('profile.my_profile'),
                onClick: () => history.push(`${match.path}/profile`),
              },
              {
                id: ItemId.ITEM_CHANGE_PASSWORD,
                text: t('profile.change_password'),
                onClick: () => history.push(`${match.path}/change-password`),
              },
              {
                id: ItemId.ITEM_SIGNATURE,
                text: t('profile.signature'),
                onClick: () => history.push(`${match.path}/signature`),
              },
              {
                id: ItemId.ITEM_COMPANY,
                hidden: !sessionStore.isAdmin,
                headline: t('profile.advanced'),
                text: t('profile.my_company'),
                onClick: () => history.push(`${match.path}/company`),
              },
              {
                id: ItemId.ITEM_USER_MANAGEMENT,
                hidden: !sessionStore.isAdmin,
                text: t('profile.user_management.title'),
                onClick: () => history.push(`${match.path}/user-management`),
              },
            ]}
          />
        </S.MainNavigationWrapper>
        <S.ContentWrapper>
          <Switch>
            <Route exact path={`${match.path}/profile`} component={Profile} />
            <Route exact path={`${match.path}/change-password`} component={ChangePassword} />
            <Route exact path={`${match.path}/signature`} component={Signature} />
            <AdminRoute exact path={`${match.path}/company`} component={Company} />
            <AdminRoute path={`${match.path}/user-management`} component={UserManagement} />
          </Switch>
        </S.ContentWrapper>
      </S.Wrapper>
    </MainPage>
  );
};

export default observer(Account);
