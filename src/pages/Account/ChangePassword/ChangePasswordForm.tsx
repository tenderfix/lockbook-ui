import React, { FunctionComponent } from 'react';
import { Form, FormikProps } from 'formik';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Button, designTheme } from '@abs-safety/lock-book-web-ui';

import FormInput from '../../../components/FormInput';
import { FormValues } from './ChangePassword';
import { sessionStore } from '../../../session/session.store';

interface ChangePasswordFormProps extends FormikProps<FormValues> {
  /** show that updating the Profile was successful */
  submitSuccess?: boolean;
}

// Styled Components
const S = {
  Title: styled.h3`
    margin-bottom: 30px;
  `,
  ChangePassword: styled.div`
    max-width: 1440px;
    margin: 65px auto 0;
  `,
  MainNavigationWrapper: styled.div`
    width: 30%;
  `,
  Wrapper: styled.div`
    display: flex;
  `,
  ContentWrapper: styled.div`
    max-width: 690px;
    width: 100%;

    h3 {
      margin-bottom: 30px;
    }
  `,
  SubmitButton: styled.div`
    text-align: right;
  `,
  Success: styled.div`
    display: block;
    border: 2px solid ${designTheme.color.primary};
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 10px;
    border-radius: 5px;

    h5 {
      color: ${designTheme.color.primary};
    }
  `,
};

const ChangePasswordForm: FunctionComponent<ChangePasswordFormProps> = (
  props: ChangePasswordFormProps
) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true}>
      <S.Title>{t('form.change_password')}</S.Title>
      <FormInput
        label={t('form.password_new')}
        placeholder={t('form.password_new_enter')}
        name="plainPassword"
        type="password"
        size="lg"
      />
      <FormInput
        label={t('form.password_repeat')}
        placeholder={t('form.password_new_repeat')}
        name="repeatedPassword"
        type="password"
        size="lg"
      />
      <p>{t('form.password_hint')} </p>
      {props.submitSuccess === true && !props.dirty && (
        <S.Success>
          <h5>{t('form.success')}</h5>
        </S.Success>
      )}
      <S.SubmitButton>
        <Button
          type={'submit'}
          disabled={!props.dirty || !props.isValid || sessionStore.waitingFor.updateUser === true}
        >
          {t('form.change_password')}
        </Button>
      </S.SubmitButton>
    </Form>
  );
};

export default observer(ChangePasswordForm);
