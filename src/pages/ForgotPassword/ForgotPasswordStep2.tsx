import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusDialog } from '../../components/StatusDialog';
import { useHistory } from 'react-router-dom';

const ForgotPasswordStep2: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <StatusDialog
      type="success"
      headline={t('forgot_password.check_emails')}
      text={
        <>
          {t('forgot_password.check_emails_info')}
          <br />
          <br />
          <strong>{t('forgot_password.hint')}</strong> {t('forgot_password.hint_info')}
        </>
      }
      primaryButton={{
        onClick: () => history.push('/login'),
        children: t('login.login'),
      }}
    />
  );
};

export default ForgotPasswordStep2;
