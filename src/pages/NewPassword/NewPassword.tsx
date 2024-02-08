import { Toast } from '@abs-safety/lock-book-web-ui';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ConstraintViolationError, NotFoundError } from '../../entities/ErrorResponse';
import NewPasswordStep1, { FormValues } from './NewPasswordStep1';
import NewPasswordStep2 from './NewPasswordStep2';
import { pageStore } from './store/page.store';
import CenteredCard from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';
import { useTranslation } from 'react-i18next';

const NewPassword: FunctionComponent = () => {
  const { t } = useTranslation();
  const [stepOpen, setStepOpen] = useState(1);
  const [error, toggleError] = useState<ConstraintViolationError | NotFoundError | undefined>(
    undefined
  );
  const confirmationToken = { confirmationToken: useLocation().search.split('?confirmation=')[1] };

  const onSubmit = (values: FormValues) => {
    pageStore
      .newPassword({ ...confirmationToken, ...values })
      .then(() => setStepOpen(stepOpen + 1))
      .catch((error) => {
        if (error instanceof ConstraintViolationError || error instanceof NotFoundError) {
          toggleError(error);
        }
      });
  };

  return (
    <PageWithBackground title={t('new_password.insert_password')}>
      {error !== undefined && (
        <Toast
          color="decline"
          offsetTop={65}
          title={error.payload.title}
          description={error.payload.detail}
          onCloseClick={() => toggleError(undefined)}
        />
      )}
      {stepOpen === 1 && (
        <CenteredCard size="sm">
          <NewPasswordStep1 onSubmit={onSubmit} />
        </CenteredCard>
      )}
      {stepOpen === 2 && <NewPasswordStep2 />}
    </PageWithBackground>
  );
};

export default observer(NewPassword);
