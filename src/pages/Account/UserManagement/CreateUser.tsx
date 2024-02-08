import { Formik, FormikState } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { getStringSchema, getStringSchemaByConstraintType } from '../../../constraints/constraints';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { DefaultAdministerValues, IUserAdminister } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';
import CreateUserForm from './CreateUserForm';

const CreateUser: FunctionComponent<IUserAdminister> = (props: IUserAdminister) => {
  const { t } = useTranslation();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, toggleError] = useState<ConstraintViolationError | false>(false);

  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<IUserAdminister>>({})
  );

  useEffect(() => {
    // Research ...maybe make values type safe
    setValidationSchema(
      Yup.object().shape<Partial<IUserAdminister>>({
        lastName: getStringSchema('User', 'lastName'),
        firstName: getStringSchema('User', 'firstName'),
        phone1: getStringSchema('User', 'phone1'),
        email: getStringSchema('User', 'email'),
        jobTitle: getStringSchema('User', 'jobTitle'),
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

  const createUser = (
    values: IUserAdminister,
    resetForm: (nextState?: Partial<FormikState<IUserAdminister>>) => void
  ): void => {
    setSubmitSuccess(false);
    toggleError(false);
    values.role = values.role ?? 'ROLE_COMPANY_TECH';

    if (sessionStore.user?.company?.id === undefined) {
      return;
    }

    pageStore
      .createCompanyMember(sessionStore.user.company.id, {
        ...values,
        roles: [values.role],
        enabled: false,
      })
      .then((response) => {
        if (response !== undefined) {
          setSubmitSuccess(true);
          resetForm({ values: DefaultAdministerValues });
        }
      })
      .catch((error) => {
        if (error instanceof ConstraintViolationError) toggleError(error);
      });
  };

  return (
    <Formik
      initialValues={props}
      enableReinitialize={false}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        createUser(values, resetForm);
      }}
    >
      {(formikBag) => <CreateUserForm {...formikBag} submitSuccess={submitSuccess} error={error} />}
    </Formik>
  );
};

export default observer(CreateUser);
