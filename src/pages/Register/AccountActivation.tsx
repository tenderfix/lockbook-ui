import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory, Switch, Route, useParams } from 'react-router-dom';
import { pageStore } from './store/page.store';
import { StatusDialog } from '../../components/StatusDialog';
import LoadingPage from '../LoadingPage/LoadingPage';
import PageWithBackground from '../../components/PageWithBackground';

const ACTIVATION_SUCCESS_PATH = '/activate/success';
const ACTIVATION_ERROR_PATH = '/activate/error';

const AccountActivation: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { activationToken } = useParams<{ activationToken: string }>();

  useEffect(() => {
    pageStore
      .activateAccount(activationToken)
      // Query parameter is important for Google Analytics to differ between registrations and invitations.
      .then(() =>
        history.push({ pathname: ACTIVATION_SUCCESS_PATH, search: window.location.search })
      )
      .catch(() =>
        history.push({ pathname: ACTIVATION_ERROR_PATH, search: window.location.search })
      );
  }, []);

  if (pageStore.waitingFor.activateAccount === true) {
    return <LoadingPage text={t('loading.general')} />;
  }

  return (
    <PageWithBackground title={t('register.activation.title')}>
      <Switch>
        <Route exact path={ACTIVATION_SUCCESS_PATH}>
          <StatusDialog
            type="success"
            headline={t('register.activation.title')}
            text={t('register.activation.text')}
            primaryButton={{
              onClick: () => history.push('/login'),
              children: t('login.login'),
            }}
          />
        </Route>
        <Route exact path={ACTIVATION_ERROR_PATH}>
          <StatusDialog
            type="error"
            headline={t('register.activation.error.title')}
            text={
              <Trans i18nKey="register.activation.error.text">
                Es scheint als wäre deine Aktivierung abgelaufen, hier kannst du dir eine neue
                Aktivierungsmail zusenden lassen.
                <br />
                <a href="/resend-account-activation" rel="noreferrer">
                  Klicke hier für eine neue Aktivierungsmail
                </a>
              </Trans>
            }
            additionalText={t('register.activation.error.additional_text')}
            primaryButton={{
              onClick: () => history.push('/login'),
              children: t('login.login'),
            }}
          />
        </Route>
      </Switch>
    </PageWithBackground>
  );
};

export default AccountActivation;
