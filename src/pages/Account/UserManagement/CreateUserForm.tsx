import { Button, FormControl } from '@abs-safety/lock-book-web-ui';
import { Form } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import FormGroup from '../../../components/FormGroup';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import { Role } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';
import { StyledForm } from '../styles/form.styles';
import { ProfileFormProps } from './UserManagement';
import { RoleMapper } from '../../../entities/RoleMapper';
import Alert from '../../../components/Alert';
import JobTitleSelection from '../../../components/JobTitleSelection';

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
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: auto;
  `,
  FormInput: styled(FormInput)`
    margin-bottom: 1px;
    background: red;
  `,
};

const CreateUserForm: FunctionComponent<ProfileFormProps> = (props: ProfileFormProps) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(props.submitSuccess);
  const [error, setError] = useState(props.error);
  const AdminRole =
    sessionStore.user !== undefined && sessionStore.user.roles?.length !== undefined
      ? sessionStore.user.roles[0]
      : 'ROLE_COMPANY_TECH';
  const selectableRoles: Role[] = new RoleMapper().getRolesByRole(AdminRole);
  const selectRolesArray = selectableRoles.map((role: Role) => {
    return { text: t(`roles.${role}`), value: role };
  });

  useEffect(() => {
    setSuccess(props.submitSuccess);
  }, [props.submitSuccess]);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  return (
    <Form noValidate={true}>
      <h3>{t('company.add_user')}</h3>
      <StyledForm.InnerForm>
        {success === true && !props.dirty && (
          <Alert type="success">{t('profile.user_management.create_user_feedback')}</Alert>
        )}
        {error !== undefined && error !== false && !props.dirty && (
          <Alert type="danger">{error.payload.title}</Alert>
        )}
        <FormGroup>
          <S.FormInput label={t('form.firstname')} name="firstName" type="text" size="sm" />
          <S.FormInput label={t('form.lastname')} name="lastName" type="text" size="sm" />
        </FormGroup>
        <S.FormInput label={t('form.phone')} name="phone1" type="text" size="sm" required={false} />
        <S.FormInput label={t('form.email')} name="email" type="text" size="sm" />
        <FormGroup>
          <FormSelect name="role" id="role" label={t('roles.title')} options={selectRolesArray} />
          <FormControl size="sm">
            <JobTitleSelection
              value={props.values.jobTitle ?? ''}
              error={props.errors.jobTitle}
              touched={props.touched.jobTitle}
              onChange={(jobTitle) => props.setFieldValue('jobTitle', jobTitle)}
              onBlur={() => props.setFieldTouched('jobTitle', true)}
              placeholder={t('form.choose_job_title')}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <S.FormInput
            label={t('form.password_new')}
            placeholder={t('form.password_new_enter')}
            name="plainPassword"
            type="password"
            size="sm"
          />
          <S.FormInput
            label={t('form.password_repeat')}
            placeholder={t('form.password_new_repeat')}
            name="repeatedPassword"
            type="password"
            size="sm"
          />
        </FormGroup>
        <StyledForm.GreyText>{t('form.password_hint')} </StyledForm.GreyText>
        <StyledForm.SubmitButton>
          <Button
            variant={'text'}
            color={'black'}
            onClick={() => pageStore.setCurrentMember(undefined)}
            disabled={pageStore.waitingFor.createUser === true}
            type={'button'}
          >
            {t('form.cancel')}
          </Button>
          <Button
            disabled={!props.dirty || pageStore.waitingFor.createUser === true}
            type={'submit'}
          >
            {t('form.submit')}
          </Button>
        </StyledForm.SubmitButton>
      </StyledForm.InnerForm>
    </Form>
  );
};

export default observer(CreateUserForm);
