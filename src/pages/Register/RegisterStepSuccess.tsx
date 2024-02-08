import React, { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import CenteredCard, { CardHeader } from '../../components/CenteredCard';
import { ReactComponent as MailSend } from '../../assets/mail_send.svg';
import styled from 'styled-components';

type RegisterStepSuccessProps = {
  email?: string;
};

const RegisterStepSuccess: FunctionComponent<RegisterStepSuccessProps> = ({
  email,
}: RegisterStepSuccessProps) => {
  const { t } = useTranslation();

  return (
    <CenteredCard size="sm">
      <S.Header>
        <MailSend />
        <h2>{t('register.completed')}</h2>
      </S.Header>
      <p>
        {email !== undefined && (
          <>
            <Trans i18nKey="register.info_mail">
              Wir haben dir eine E-Mail an <strong>{{ email }}</strong> gesendet.
            </Trans>
            <br />
            <br />
          </>
        )}
        <Trans i18nKey="register.info_instructions">
          Die E-Mail enthält Deinen <strong>Benutzernamen</strong> und den{' '}
          <strong>Aktivierungslink</strong>. Klicke auf den Link, um Dein Lock Book Konto zu
          aktivieren. Dann kannst Du Dich mit Deinem Benutzernamen und Passwort anmelden.
        </Trans>
        <br />
        <br />
        <Trans i18nKey="register.info_help">
          Der E-Mailversand kann einige Minuten dauern. Keine E-Mail erhalten? Schaut in den
          Spam-Ordner oder{' '}
          <a
            href="https://abssafety.atlassian.net/servicedesk/customer/portal/2/group/12"
            target="_blank"
            rel="noreferrer"
          >
            melde Dich bei uns
          </a>
          .
        </Trans>
      </p>
    </CenteredCard>
  );
};

const S = {
  Header: styled(CardHeader)`
    text-align: center;

    h2 {
      margin-top: 30px;
    }
  `,
};

export default RegisterStepSuccess;
