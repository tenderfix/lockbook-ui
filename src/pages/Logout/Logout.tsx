import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { sessionStore } from '../../session/session.store';
import LoadingPage from '../LoadingPage/LoadingPage';

const Logout: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await sessionStore.logout();
      const queryParams = new URLSearchParams(window.location.search);
      const redirect = queryParams.get('redirect');
      const withAppRedirect = queryParams.get('withAppRedirect');

      if (withAppRedirect !== null) {
        history.push(`/login?withAppRedirect=${withAppRedirect}`);
      } else if (redirect !== null) {
        history.push(`/login?redirect=${redirect}`);
      } else {
        console.log('redirecting to login');
        history.push('/login');
      }
    })();
  }, []);

  return <LoadingPage text={t('loading.logout')} />;
};

export default Logout;
