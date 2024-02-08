import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusDialog } from '../../components/StatusDialog';
import { useHistory } from 'react-router-dom';

const NewPasswordStep2: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <StatusDialog
      type="success"
      headline={t('new_password.password_saved')}
      text={t('new_password.password_saved_info')}
      primaryButton={{
        onClick: () => history.push('/login'),
        children: t('login.login'),
      }}
    />
  );
};

export default NewPasswordStep2;
