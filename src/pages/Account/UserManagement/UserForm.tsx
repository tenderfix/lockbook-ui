import { Button, FormControl } from '@abs-safety/lock-book-web-ui';
import { Form } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '../../../components/FormGroup';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import { IUserAdminister, Role } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';
import { StyledForm } from '../styles/form.styles';
import { ProfileFormProps } from './UserManagement';
import { RoleMapper } from '../../../entities/RoleMapper';
import Alert from '../../../components/Alert';
import JobTitleSelection from '../../../components/JobTitleSelection';

const roleMapper = new RoleMapper();

const UserForm: FunctionComponent<ProfileFormProps> = (props: ProfileFormProps) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<IUserAdminister>(props.values);
  const [success, setSuccess] = useState(props.submitSuccess);
  const error = props.error ?? false;
  const adminRole = sessionStore.user?.roles?.[0] ?? undefined;
  const selectableRoles: Role[] = roleMapper.getRolesByRole(adminRole);

  const selectRolesArray = selectableRoles.map((role: Role) => {
    return { text: t(`roles.${role}`), value: role };
  });

  const toggleUser = () => {
    setSuccess(false);

    if (user.id === undefined) {
      return;
    }

    const isEnabled = user.enabled === undefined ? false : !user.enabled;

    pageStore
      .updateUser({ enabled: isEnabled }, user.id)
      .then((response) => {
        if (response !== undefined) {
          setSuccess(true);
        }
      })
      .catch(() => setSuccess(false));
  };

  useEffect(() => {
    setUser(props.values);
  }, [props.values]);

  useEffect(() => {
    setSuccess(props.submitSuccess);
  }, [props.submitSuccess]);

  return (
    <Form noValidate={true}>
      <StyledForm.InnerForm>
        {success === true && !props.dirty && (
          <Alert type="success" id="formSuccess">
            {t('form.success')}
          </Alert>
        )}
        {error !== false && !props.dirty && <Alert type="danger">{error.payload.title}</Alert>}
        <FormInput
          readOnly={true}
          label={t('form.username')}
          name="username"
          type="text"
          size="lg"
        />
        <FormGroup>
          <FormInput label={t('form.firstname')} name="firstName" type="text" size="lg" />
          <FormInput label={t('form.lastname')} name="lastName" type="text" size="lg" />
        </FormGroup>
        <FormInput label={t('form.phone')} name="phone1" type="text" size="lg" required={false} />
        <FormInput label={t('form.email')} name="email" type="text" size="lg" />
        {user.role !== undefined && selectableRoles.indexOf(user.role) >= 0 ? (
          <>
            <FormGroup>
              <FormSelect
                name="role"
                id="role"
                label={t('roles.title')}
                options={selectRolesArray}
              />
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
            <StyledForm.SubmitButton className={'multibutton'}>
              <Button
                id={user.enabled ?? false ? 'disableButton' : 'enableButton'}
                onClick={toggleUser}
                disabled={pageStore.waitingFor.updateUser === true}
                variant={'outline'}
                color={user.enabled ?? false ? 'decline' : 'primary'}
                type={'button'}
              >
                {user.enabled ?? false ? t('form.deactivate') : t('form.activate')}
              </Button>
              <Button
                disabled={!props.dirty || pageStore.waitingFor.updateUser === true}
                type={'submit'}
              >
                {t('form.submit')}
              </Button>
            </StyledForm.SubmitButton>{' '}
          </>
        ) : (
          ''
        )}
      </StyledForm.InnerForm>
    </Form>
  );
};
export default observer(UserForm);
