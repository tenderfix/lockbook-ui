import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FieldSignature,
  Signature as SignatureType,
  unitize,
} from '@abs-safety/lock-book-web-ui';
import { sessionStore } from '../../../session/session.store';

interface SignatureProps {
  /** show that updating the Profile was successful */
  submitSuccess?: boolean;
}

// Styled Components
const S = {
  Component: styled.div`
    max-width: ${unitize(690)};
  `,
  Title: styled.h4`
    margin-top: ${unitize(50)};
    margin-bottom: ${unitize(20)};
  `,
  Description: styled.p`
    margin-top: ${unitize(20)};
    margin-bottom: ${unitize(20)};
  `,
  SubmitButton: styled.div`
    text-align: right;
  `,
};

const Signature: FunctionComponent<SignatureProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const userId = sessionStore.user?.id;
  const [signatureInput, setSignatureInput] = useState<SignatureType>();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (sessionStore.user === undefined) {
      return;
    }
  }, [sessionStore.user]);

  const onSignatureInput = (signatureCanvas: SignatureCanvas) => {
    setButtonDisabled(false);
    const base64String = signatureCanvas.toDataURL('image/png');
    const base64Array = base64String.split(',');
    setSignatureInput(base64Array);
  };

  const onSubmit = async () => {
    if (signatureInput === undefined) return;
    if (userId === undefined) return;

    if (location.search.toString().includes('?open') === true) {
      await sessionStore.updateUser({ signature: signatureInput }, userId);
      const redirect = location.search.toString().substring(5);
      window.open(redirect, '_self');
    } else {
      sessionStore.updateUser({ signature: signatureInput }, userId);
    }
    setButtonDisabled(true);
  };

  const deleteSignature = () => {
    if (userId === undefined) return;
    if (sessionStore.user?.signature !== []) {
      setSignatureInput([]);
      sessionStore.updateUser({ signature: [] }, userId);
      setButtonDisabled(true);
    }
  };

  return (
    <S.Component>
      <S.Title>{t('user.signature_header')}</S.Title>
      <S.Description>{t('user.signature_advice')}</S.Description>
      <FieldSignature
        disabled={false}
        onSignatureEnd={onSignatureInput}
        signature={sessionStore.user?.signature !== [] ? sessionStore.user?.signature : []}
        onSignatureDelete={deleteSignature}
        mobilePlaceholderVideoUrl={'/signature_mobile.mp4'}
        desktopPlaceholderVideoUrl={'/signature_desktop.mp4'}
      />
      <S.Description>{t('user.signature_text_below')}</S.Description>
      <S.SubmitButton>
        <Button disabled={buttonDisabled} type="button" onClick={() => onSubmit()}>
          {t('user.signature_submit')}
        </Button>
      </S.SubmitButton>
    </S.Component>
  );
};

export default observer(Signature);
