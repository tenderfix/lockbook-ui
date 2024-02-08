import { Toast } from '@abs-safety/lock-book-web-ui';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { ConstraintViolationError, NotFoundError } from '../../entities/ErrorResponse';
import ForgotPasswordStep1, { FormValues } from './ForgotPasswordStep1';
import ForgotPasswordStep2 from './ForgotPasswordStep2';
import { pageStore } from './store/page.store';
import CenteredCard from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';
import { useTranslation } from 'react-i18next';

const ForgotPassword: FunctionComponent = () => {
  const { t } = useTranslation();
  const [stepOpen, setStepOpen] = useState(1);
  const [error, toggleError] = useState<ConstraintViolationError | NotFoundError | undefined>(
    undefined
  );

  const onSubmit = (values: FormValues) => {
    pageStore
      .resetPassword(values)
      .then(() => setStepOpen(stepOpen + 1))
      .catch((error) => {
        if (error instanceof ConstraintViolationError || error instanceof NotFoundError) {
          toggleError(error);
        }
      });
  };

  return (
    <PageWithBackground title={t('forgot_password.reset_password')}>
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
          <ForgotPasswordStep1 onSubmit={onSubmit} />
        </CenteredCard>
      )}
      {stepOpen === 2 && <ForgotPasswordStep2 />}
    </PageWithBackground>
  );
};

export default observer(ForgotPassword);
