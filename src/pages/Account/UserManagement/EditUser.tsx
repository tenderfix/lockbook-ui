import { MainNavigation } from '@abs-safety/lock-book-web-ui';
import { Formik, FormikState } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { getStringSchema, getStringSchemaByConstraintType } from '../../../constraints/constraints';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { IUserAdminister, Role } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';
import ChangePasswordForm from './PasswordForm';
import UserForm from './UserForm';
import { RoleMapper } from '../../../entities/RoleMapper';

type Tabs = 'details' | 'password';

const roleMapper = new RoleMapper();
const EditUser: FunctionComponent<IUserAdminister> = (props: IUserAdminister) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<IUserAdminister>(props);
  const [tab, setTab] = useState<Tabs>('details');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, toggleError] = useState<ConstraintViolationError | false>(false);
  const [validationSchemaUser, setValidationSchemaUser] = useState(
    Yup.object().shape<Partial<IUserAdminister>>({})
  );
  const [validationSchemaPassword, setValidationSchemaPassword] = useState(
    Yup.object().shape<Partial<IUserAdminister>>({})
  );

  const TabsConfig = [
    {
      id: 'details',
      text: t('user.details'),
      onClick: () => switchTab('details'),
    },
  ];
  const adminRole = sessionStore.user?.roles?.[0] ?? undefined;
  const selectableRoles: Role[] = roleMapper.getRolesByRole(adminRole);

  if (user.role !== undefined && selectableRoles.indexOf(user.role) >= 0) {
    TabsConfig.push({
      id: 'password',
      text: t('profile.change_password'),
      onClick: () => switchTab('password'),
    });
  }

  const switchTab = (tab: Tabs) => {
    setSubmitSuccess(false);
    toggleError(false);
    setTab(tab);
  };

  const updateUser = (
    values: IUserAdminister,
    resetForm: (nextState?: Partial<FormikState<IUserAdminister>>) => void
  ) => {
    setSubmitSuccess(false);
    toggleError(false);

    if (user.id === undefined) {
      return;
    }

    values.role = values.role ?? 'ROLE_COMPANY_TECH';
    pageStore
      .updateUser(
        {
          ...values,
          roles: [values.role],
        },
        user.id
      )
      .then((response) => {
        if (response !== undefined) {
          setSubmitSuccess(true);
          submitSuccess && resetForm({ values: response });
        }
      })
      .catch((error) => {
        if (error instanceof ConstraintViolationError) {
          toggleError(error);
        }
      });
  };

  useEffect(() => {
    setUser(pageStore.currentMember ?? props);
  }, [pageStore.currentMember]);

  useEffect(() => {
    setValidationSchemaUser(
      Yup.object().shape<Partial<IUserAdminister>>({
        lastName: getStringSchema('User', 'lastName'),
        firstName: getStringSchema('User', 'firstName'),
        phone1: getStringSchema('User', 'phone1'),
        email: getStringSchema('User', 'email'),
      })
    );
  }, [sessionStore.constraints]);

  useEffect(() => {
    setValidationSchemaPassword(
      Yup.object().shape<Partial<IUserAdminister>>({
        plainPassword: getStringSchema('User', 'plainPassword'),
        repeatedPassword: getStringSchemaByConstraintType(
          'User',
          'repeatedPassword',
          'NotBlank'
        ).test('repeatedPassword', t('form.password_matching'), function (value) {
          return this.parent.plainPassword === value;
        }),
      })
    );
  }, [sessionStore.constraints]);

  if (isEmpty(sessionStore.constraints)) {
    return <p>{t('loading.general')}</p>;
  }

  return (
    <>
      <MainNavigation items={TabsConfig} activeId={tab} />
      {tab === 'details' ? (
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={validationSchemaUser}
          onSubmit={(values, { resetForm }) => {
            updateUser(values, resetForm);
          }}
        >
          {(formikBag) => <UserForm {...formikBag} submitSuccess={submitSuccess} error={error} />}
        </Formik>
      ) : (
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={validationSchemaPassword}
          onSubmit={(values, { resetForm }) => {
            updateUser(values, resetForm);
          }}
        >
          {(formikBag) => (
            <ChangePasswordForm {...formikBag} submitSuccess={submitSuccess} error={error} />
          )}
        </Formik>
      )}
    </>
  );
};

export default observer(EditUser);
