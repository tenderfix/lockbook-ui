import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorPageTemplate from './ErrorPageTemplate';

const Error403: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <ErrorPageTemplate
      headline={t('error.403')}
      statusCode={403}
      text={t('error.error_text')}
      secondBtn={{
        href: 'https://support.lock-book.com',
        text: `${t('error.send_feedback_button')}`,
      }}
    />
  );
};

export default Error403;
