import { Toast } from '@abs-safety/lock-book-web-ui';
import { Formik, FormikState } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { getStringSchema } from '../../../constraints/constraints';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { IUserBase, IUserCreate } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import ProfileForm from './ProfileForm';
import { ICompanyBase } from '../../../entities/Company';

// Styled Components
const S = {
  Wrapper: styled.div`
    max-width: 690px;
  `,
};

type EditableValues = Pick<
  IUserCreate,
  'lastName' | 'firstName' | 'phone1' | 'email' | 'acceptedLockBookNewsletter'
>;

type ReadOnlyValues = Pick<IUserBase, 'username'> & { company: ICompanyBase['name'] };

export type FormValues = EditableValues & ReadOnlyValues;

const Profile: FunctionComponent = () => {
  const { t } = useTranslation();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | undefined>();
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<FormValues>>({})
  );
  const [error, toggleError] = useState<ConstraintViolationError | undefined>(undefined);

  useEffect(() => {
    if (sessionStore.user === undefined) {
      return;
    }
    setInitialValues({
      username: sessionStore.user.username ?? '',
      company: sessionStore.user.company?.name ?? '',
      lastName: sessionStore.user.lastName ?? '',
      firstName: sessionStore.user.firstName ?? '',
      phone1: sessionStore.user.phone1 ?? '',
      email: sessionStore.user.email ?? '',
      acceptedLockBookNewsletter: sessionStore.user.acceptedLockBookNewsletter ?? false,
    });
  }, [sessionStore.user]);

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape<Partial<FormValues>>({
        lastName: getStringSchema('User', 'lastName'),
        firstName: getStringSchema('User', 'firstName'),
        phone1: getStringSchema('User', 'phone1'),
        email: getStringSchema('User', 'email'),
      })
    );
  }, [sessionStore.constraints]);

  const onSubmit = (
    values: FormValues,
    resetForm: (nextState?: Partial<FormikState<FormValues>>) => void
  ) => {
    if (sessionStore.user === undefined) return;

    sessionStore
      .updateUser(
        {
          firstName: values.firstName ?? '',
          lastName: values.lastName ?? '',
          phone1: values.phone1 ?? '',
          email: values.email ?? '',
          acceptedLockBookNewsletter: values.acceptedLockBookNewsletter ?? false,
        },
        sessionStore.user.id
      )
      .then(() => {
        resetForm({});
        setSubmitSuccess(true);
      })
      .catch((err) => {
        if (err instanceof ConstraintViolationError) toggleError(err);
        setSubmitSuccess(false);
      });
  };

  return isEmpty(sessionStore.constraints) ? (
    <p>{t('loading.general')}</p>
  ) : initialValues === undefined ? (
    <p>{t('user.not_found')}</p>
  ) : (
    <S.Wrapper>
      {error !== undefined && (
        <Toast
          color="decline"
          offsetTop={65}
          title={error.payload.title}
          description={error.payload.violations[0].message}
          onCloseClick={() => toggleError(undefined)}
        />
      )}
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values, resetForm);
        }}
      >
        {(formikBag) => <ProfileForm {...formikBag} submitSuccess={submitSuccess} />}
      </Formik>
    </S.Wrapper>
  );
};

export default observer(Profile);
