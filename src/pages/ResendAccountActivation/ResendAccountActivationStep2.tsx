import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusDialog } from '../../components/StatusDialog';
import { useHistory } from 'react-router-dom';

const ResendAccountActivationSetp2: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <StatusDialog
      type="success"
      headline={t('new_account_activation.check_emails')}
      text={
        <>
          {t('new_account_activation.check_emails_info')}
          <br />
          <br />
          <strong>{t('new_account_activation.hint')}</strong>{' '}
          {t('new_account_activation.hint_info')}
        </>
      }
      primaryButton={{
        onClick: () => history.push('/login'),
        children: t('login.login'),
      }}
    />
  );
};

export default ResendAccountActivationSetp2;
