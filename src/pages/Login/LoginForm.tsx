import React, { FunctionComponent, useEffect, useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { IUserLogin } from '../../entities/User';
import FormInput from '../../components/FormInput';
import { observer } from 'mobx-react';
import { getStringSchema, getStringSchemaByConstraintType } from '../../constraints/constraints';
import styled from 'styled-components';
import { Button, designTheme } from '@abs-safety/lock-book-web-ui';
import { useTranslation } from 'react-i18next';
import { sessionStore } from '../../session/session.store';
import { FormikHelpers } from 'formik/dist/types';
import Alert from '../../components/Alert';

export type LoginFormValues = IUserLogin;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues, formikHelpers: FormikHelpers<LoginFormValues>) => void;
}

const Login: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<LoginFormValues>>({})
  );

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape<Partial<LoginFormValues>>({
        username: getStringSchema('User', 'username'),
        // It is uncertain if some users already have passwords not matching our password regex
        password: getStringSchemaByConstraintType('User', 'password', 'NotBlank'),
      })
    );
  }, [sessionStore.constraints]);

  return (
    <Formik<LoginFormValues>
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikProps) => <ObservedLoginForm {...formikProps} />}
    </Formik>
  );
};

const LoginForm: FunctionComponent<FormikProps<LoginFormValues>> = (formikProps) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true}>
      <h2>{t('login.login')}</h2>
      <S.LoginContent>
        <S.TextWrapper>
          {t('login.new_user')}{' '}
          <Link to={'/signup'} title={t('login.register')}>
            {t('login.register')}
          </Link>
        </S.TextWrapper>
        <FormInput
          type="text"
          name="username"
          label={t('form.username')}
          placeholder={t('form.firstname').toLowerCase() + '.' + t('form.lastname').toLowerCase()}
          size="sm"
        />
        <FormInput type="password" name="password" label={t('form.password')} size="sm" />
        {formikProps.status !== undefined && (
          <Alert type="danger">
            {formikProps.status}
            {formikProps.submitCount > 2 && ' ' + t('login.forgot_password_hint')}
          </Alert>
        )}
      </S.LoginContent>
      <S.FooterWrapper>
        <Link to={'/forgot-password'} title={t('login.forgot_account')}>
          {t('login.forgot_account')}
        </Link>
        <S.ButtonWrapper>
          <Button
            type="submit"
            disabled={
              sessionStore.waitingFor.login === true || sessionStore.waitingFor.loadUser === true
            }
          >
            {t('login.login')}
          </Button>
        </S.ButtonWrapper>
      </S.FooterWrapper>
    </Form>
  );
};

const ObservedLoginForm = observer(LoginForm);
export default observer(Login);

const S = {
  LoginContent: styled.div`
    margin-top: 15px;
  `,
  TextWrapper: styled.p`
    margin-bottom: 45px;
    a {
      text-decoration: none;
      font-weight: ${designTheme.typography.weight.bold};
      color: ${designTheme.color.primary};
    }
  `,
  FooterWrapper: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 38px;

    a {
      margin-top: 15px;
      font-weight: ${designTheme.typography.weight.bold};
      text-decoration: none;
      color: ${designTheme.color.black};
    }
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
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: auto;
  `,
};
