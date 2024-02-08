import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ButtonGroup, Toast } from '@abs-safety/lock-book-web-ui';
import { Trans, useTranslation } from 'react-i18next';

import { sessionStore } from '../../session/session.store';
import CenteredCard, { CardFooter, CardHeader } from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';

const Legal: React.FC = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation();
  const [hasError, setError] = useState<boolean>(false);

  const onAccept = async () => {
    setError(false);

    try {
      await sessionStore.acceptLatestLegalDocuments();
      redirectOnSuccess();
    } catch (error) {
      setError(true);
    }
  };

  const onDecline = async () => {
    const params = new URLSearchParams(search);
    const redirect = params.get('redirect');
    const withAppRedirect = params.get('withAppRedirect');
    if (withAppRedirect !== null) {
      history.push(`/logout?withAppRedirect=${withAppRedirect}`);
    } else if (redirect !== null) {
      history.push(`/logout?redirect=${redirect}`);
    } else {
      history.push('/logout');
    }
  };

  const redirectOnSuccess = () => {
    const params = new URLSearchParams(search);
    const withAppRedirect = params.get('withAppRedirect');
    const redirect = params.get('redirect');
    if (withAppRedirect !== null) {
      window.location.replace(
        `${process.env.REACT_APP_API_URL}/app-login?platform=${withAppRedirect}`
      );
      return;
    }
    if (redirect !== null) {
      window.location.replace(redirect);
      return;
    }
    history.replace('/services');
  };

  return (
    <PageWithBackground title={t('legal.headline')}>
      {hasError === true && (
        <Toast
          color="decline"
          offsetTop={65}
          title="Technischer Fehler"
          description="Beim Verarbeiten Deiner Anfrage ist ein Fehler aufgetreten."
          onCloseClick={() => setError(false)}
        />
      )}
      <CenteredCard size="sm">
        <CardHeader>
          <h2>{t('legal.headline')}</h2>
        </CardHeader>
        <p>
          <Trans i18nKey="legal.text">
            Die{' '}
            <a
              href="https://info.lock-book.com/nutzungsbedingungen"
              target="_blank"
              rel="noreferrer"
            >
              Nutzungsbedingungen
            </a>{' '}
            und{' '}
            <a
              href="https://info.lock-book.com/impressum-datenschutz"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutzbestimmungen
            </a>{' '}
            wurden aktualisiert. Akzeptiere diese um fortzufahren. Andernfalls wirst du automatisch
            abgemeldet.
          </Trans>
        </p>
        <CardFooter>
          <ButtonGroup
            buttonLeft={{
              label: t('legal.decline'),
              variant: 'text',
              color: 'decline',
              onClick: onDecline,
              disabled: sessionStore.waitingFor.acceptLatestLegalDocuments === true,
            }}
            buttonRight={{
              label: t('legal.accept'),
              color: 'primary',
              onClick: onAccept,
              disabled: sessionStore.waitingFor.acceptLatestLegalDocuments === true,
            }}
          />
        </CardFooter>
      </CenteredCard>
    </PageWithBackground>
  );
};

export default Legal;
