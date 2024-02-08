import { Button, designTheme, Popup } from '@abs-safety/lock-book-web-ui';
import { Form, Formik, FormikProps } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import { getStringSchema } from '../../constraints/constraints';
import { IUserCreate } from '../../entities/User';
import { sessionStore } from '../../session/session.store';

export type FormValues = Pick<IUserCreate, 'username'>;

interface ForgotPasswordProps {
  onSubmit: (values: FormValues) => void;
}

const ForgotPasswordStep1: FunctionComponent<ForgotPasswordProps> = (
  props: ForgotPasswordProps
) => {
  const { t } = useTranslation();

  const [initialValues] = useState<FormValues>({
    username: '',
  });

  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<FormValues>>({})
  );

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape<Partial<FormValues>>({
        username: getStringSchema('User', 'username'),
      })
    );
  }, [sessionStore.constraints]);

  return isEmpty(sessionStore.constraints) ? (
    <p>{t('loading.general')}</p>
  ) : (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikBag) => <ObservedForm {...formikBag} />}
    </Formik>
  );
};

const S = {
  ContentWrapper: styled.div`
    margin-top: -15px;
  `,
  HeadlineWrapper: styled.h2`
    margin: 0 0 24px 0;
    padding-right: 20px;
    font-size: 32px;
    white-space: pre-wrap;
  `,
  RegularHeadline: styled.span`
    font-weight: normal;
  `,
  TextWrapper: styled.p`
    font-size: 15px;
    margin-bottom: 50px;

    a {
      text-decoration: none;
      font-weight: bold;
      color: ${designTheme.color.primary};
    }
  `,
  AccountNote: styled.div`
    background-color: ${designTheme.color.lightestgrey};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 25px;
    border-radius: ${designTheme.borderRadius};
    margin-bottom: 25px;

    svg {
      margin-right: 25px;
    }
  `,
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    padding-top: 38px;
    justify-content: space-between;
  `,
  FormInfo: styled.span`
    display: block;
    margin-top: -10px;
    font-size: 14px;
  `,
  LostAccountPopup: styled.div`
    text-align: left;
    a {
      color: #fff;
      text-decoration: underline;
    }
    p {
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
  `,
};

const ForgotPasswordStep1Form: FunctionComponent<FormikProps<FormValues>> = (
  props: FormikProps<FormValues>
) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <S.HeadlineWrapper>
        <span>{t('forgot_password.reset_password')}</span>
      </S.HeadlineWrapper>
      <S.ContentWrapper>
        <S.TextWrapper>{t('forgot_password.info')} </S.TextWrapper>
        <FormInput
          label={t('form.username')}
          placeholder={t('form.firstname').toLowerCase() + '.' + t('form.lastname').toLowerCase()}
          name="username"
          type="text"
          size="sm"
        />
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button type={'submit'} disabled={!props.dirty || !props.isValid}>
          {t('form.send')}
        </Button>
        <Popup
          position={{
            top: '35px',
          }}
          toggleNode={
            <Button as={'a'} color={'black'} variant={'text'}>
              {t('forgot_password.forgot_username.title')}
            </Button>
          }
          popupContent={
            <S.LostAccountPopup>
              <strong>{t('forgot_password.forgot_username.title')}</strong>
              <Trans i18nKey="forgot_password.forgot_username.text">
                <p>
                  Du findest weder Dein Passwort noch Deinen Benutzernamen? Wir helfen Dir weiter.
                  Nutze einfach unser{' '}
                  <a title="Lock Book Support" href="http://support.lock-book.com">
                    {' '}
                    Formular
                  </a>{' '}
                  oder ruf uns an unter{' '}
                  <a title="Lock Book Support Telefon" href={`tel:+49283297281130`}>
                    +49&nbsp;2832&nbsp;97281-130
                  </a>
                  .
                </p>
              </Trans>
            </S.LostAccountPopup>
          }
        />
      </S.ButtonWrapper>
    </Form>
  );
};

const ObservedForm = observer(ForgotPasswordStep1Form);
export default observer(ForgotPasswordStep1);
