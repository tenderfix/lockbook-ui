import { Button } from '@abs-safety/lock-book-web-ui';
import { Form } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../../../components/FormInput';
import { sessionStore } from '../../../session/session.store';
import { StyledForm } from '../styles/form.styles';
import { ProfileFormProps } from './UserManagement';
import Alert from '../../../components/Alert';

const PasswordForm: FunctionComponent<ProfileFormProps> = (props: ProfileFormProps) => {
  const { t } = useTranslation();
  const error = props.error ?? false;
  const success = props.submitSuccess ?? false;

  return (
    <Form noValidate={true}>
      <StyledForm.InnerForm>
        {success && !props.dirty && <Alert type="success">{t('form.success')}</Alert>}
        {error !== false && !props.dirty && <Alert type="danger">{error.payload.title}</Alert>}
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
        <StyledForm.GreyText>{t('form.password_hint')} </StyledForm.GreyText>
      </StyledForm.InnerForm>
      <StyledForm.SubmitButton>
        <Button
          type={'submit'}
          disabled={!props.dirty || sessionStore.waitingFor.updateUser === true}
        >
          {t('form.change_password')}
        </Button>
      </StyledForm.SubmitButton>
    </Form>
  );
};

export default observer(PasswordForm);
