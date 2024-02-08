import React, { FunctionComponent, useState } from 'react';
import { Toast } from '@abs-safety/lock-book-web-ui';
import { useHistory, useLocation } from 'react-router-dom';

import { ForbiddenError, UnauthorizedError } from '../../entities/ErrorResponse';
import { sessionStore } from '../../session/session.store';
import LoginForm, { LoginFormValues } from './LoginForm';
import CenteredCard from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';
import { useTranslation } from 'react-i18next';
import { FormikHelpers } from 'formik/dist/types';
import { pushUserData } from '../../analytics';
import { ICompanyRead } from '../../entities/Company';

const Login: FunctionComponent = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation();
  const [error, toggleError] = useState<Error | undefined>(undefined);

  const onSubmit = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>
  ) => {
    formikHelpers.setStatus(undefined);

    try {
      await sessionStore.login(values);
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        formikHelpers.setStatus(error.message);
        return;
      }
    }

    try {
      const [hasAcceptedLatestLegalDocuments, user] = await Promise.all([
        sessionStore.hasAcceptedLatestLegalDocuments(),
        sessionStore.loadUser(),
      ]);
      pushUserData(user.id, (user.company as ICompanyRead).id);
      redirectOnSuccess(hasAcceptedLatestLegalDocuments);
    } catch (error) {
      toggleError(error);
    }
  };

  const redirectOnSuccess = (hasAcceptedLatestLegalDocuments: boolean) => {
    const params = new URLSearchParams(search);
    const redirect = params.get('redirect');
    const withAppRedirect = params.get('withAppRedirect');

    if (hasAcceptedLatestLegalDocuments === false) {
      if (withAppRedirect !== null) {
        history.replace(`/legal?withAppRedirect=${withAppRedirect}`);
      } else if (redirect !== null) {
        history.replace(`/legal?redirect=${redirect}`);
      } else {
        history.replace(`/legal`);
      }
      return;
    }

    if (withAppRedirect !== null) {
      window.location.replace(
        `${process.env.REACT_APP_API_URL}/app-login?platform=${withAppRedirect}`
      );
      console.log('redirecting to app login');
    } else if (redirect !== null) {
      window.location.replace(redirect);
    } else {
      history.replace('/services');
    }
  };

  return (
    <PageWithBackground title={t('login.login')}>
      {error !== undefined && (
        <Toast
          color="decline"
          offsetTop={65}
          title={error.name}
          description={error.message}
          onCloseClick={() => toggleError(undefined)}
        />
      )}
      <CenteredCard size="sm">
        <LoginForm onSubmit={onSubmit} />
      </CenteredCard>
    </PageWithBackground>
  );
};

export default Login;
