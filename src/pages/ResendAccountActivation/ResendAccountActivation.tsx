import { Toast } from '@abs-safety/lock-book-web-ui';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { ConstraintViolationError, NotFoundError } from '../../entities/ErrorResponse';
import CenteredCard from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';
import { useTranslation } from 'react-i18next';
import ResendAccountActivationSetp2 from './ResendAccountActivationStep2';
import ResendAccountActivationStep1, { FormValues } from './ResendAccountActivationStep1';
import { pageStore } from './store/page.store';

const ResendAccountActivation: FunctionComponent = () => {
  const { t } = useTranslation();
  const [stepOpen, setStepOpen] = useState(1);
  const [error, toggleError] = useState<ConstraintViolationError | NotFoundError | undefined>(
    undefined
  );

  const onSubmit = (values: FormValues) => {
    pageStore
      .resendAccountActivation(values)
      .then(() => setStepOpen(stepOpen + 1))
      .catch((error) => {
        if (error instanceof ConstraintViolationError || error instanceof NotFoundError) {
          toggleError(error);
        }
      });
  };

  return (
    <PageWithBackground title={t('new_account_activation.resend_account_activation')}>
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
          <ResendAccountActivationStep1 onSubmit={onSubmit} />
        </CenteredCard>
      )}
      {stepOpen === 2 && <ResendAccountActivationSetp2 />}
    </PageWithBackground>
  );
};

export default observer(ResendAccountActivation);
