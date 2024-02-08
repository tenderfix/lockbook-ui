import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Toast } from '@abs-safety/lock-book-web-ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import IconDocu from '../../assets/IconDocu';
import IconDraw from '../../assets/IconDraw';
import HubCard from '../../components/HubCard';
import { sessionStore } from '../../session/session.store';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import IconGaeb from '../../assets/IconGaeb';
import { useGaebUpload } from '../../hooks/useGaebUpload';

// Styled Components
const S = {
  Hub: styled.div`
    text-align: center;
  `,
  Headline: styled.h1`
    margin-top: 5vh;
    margin-bottom: 2vh;
  `,
  SubHeadline: styled.h2`
    margin-bottom: 5vh;
    font-weight: normal;
  `,
  CardWrapper: styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    margin: 0 2.5%;
    @media (max-width: 1139px) {
      flex-direction: column;
      align-items: center;
    }
  `,
};

const Hub: FunctionComponent = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('services.document_title'));
  const { UPLOAD_STATES, handleSubmit, onClose, file, status, hideToast } = useGaebUpload();

  return (
    <S.Hub>
      <S.Headline>{t('services.welcome', { firstName: sessionStore.user?.firstName })}</S.Headline>
      <S.SubHeadline>{t('services.use')}</S.SubHeadline>
      {!hideToast && status === UPLOAD_STATES.UPLOADING && (
        <Toast
          color="black"
          title={'Uploading'}
          description={`Uploading File:${file?.name}`}
          onCloseClick={onClose}
          onFadedOut={() => {
            console.log('closed');
          }}
        />
      )}
      {!hideToast && status === UPLOAD_STATES.SUCCESS && (
        <Toast
          color="primary"
          title={'Uploaded'}
          description={`${file?.name} uploaded successfully`}
          onCloseClick={onClose}
          onFadedOut={() => {
            console.log('closed');
          }}
        />
      )}
      {!hideToast && status === UPLOAD_STATES.ERROR && (
        <Toast
          color="decline"
          title={'Error'}
          description={`Error in uploading ${file?.name}`}
          onCloseClick={onClose}
          onFadedOut={() => {
            console.log('closed');
          }}
        />
      )}
      <S.CardWrapper>
        <HubCard
          title="Draw"
          description={t('services.draw.description')}
          readMore={'https://info.lock-book.com/draw'}
          imageSrc="/hub-draw.png"
          icon={<IconDraw width={48} height={48} />}
          desktop={true}
          mobile={false}
          buttonText={t('services.draw.button')}
          buttonUrl={process.env.REACT_APP_DRAW_URL ?? ''}
        />
        <HubCard
          title="Docu"
          description={t('services.docu.description')}
          readMore={'https://info.lock-book.com/docu'}
          imageSrc="/hub-docu.png"
          icon={<IconDocu width={48} height={48} />}
          desktop={true}
          mobile={true}
          buttonText={t('services.docu.button')}
          buttonUrl={process.env.REACT_APP_DOCU_URL ?? ''}
        />
        <HubCard
          title="GAEB"
          description={t('services.gaeb.description')}
          readMore={'https://info.lock-book.com/docu'}
          imageSrc="/hub-gaeb.png"
          icon={<IconGaeb width={48} height={48} />}
          desktop={true}
          mobile={false}
          buttonText={t('services.gaeb.button')}
          buttonUrl={process.env.REACT_APP_DOCU_URL ?? ''}
          handleSubmit={handleSubmit}
          disabled={status === UPLOAD_STATES.UPLOADING}
        />
      </S.CardWrapper>
    </S.Hub>
  );
};

export default observer(Hub);
