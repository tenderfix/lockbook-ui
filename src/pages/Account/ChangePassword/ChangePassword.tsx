import { Toast } from '@abs-safety/lock-book-web-ui';
import { Formik, FormikState } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { getStringSchema, getStringSchemaByConstraintType } from '../../../constraints/constraints';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { IUserCreate } from '../../../entities/User';
import { sessionStore } from '../../../session/session.store';
import ChangePasswordForm from './ChangePasswordForm';

// Styled Components
const S = {
  Wrapper: styled.div`
    max-width: 690px;
  `,
};

export type FormValues = Pick<IUserCreate, 'plainPassword' | 'repeatedPassword'>;

const ChangePassword: FunctionComponent = () => {
  const { t } = useTranslation();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [initialValues] = useState<FormValues>({
    plainPassword: '',
    repeatedPassword: '',
  });

  const [validationSchema, setvalidationSchema] = useState(
    Yup.object().shape<Partial<FormValues>>({})
  );

  const [error, toggleError] = useState<ConstraintViolationError | undefined>(undefined);

  useEffect(() => {
    setvalidationSchema(
      Yup.object().shape<Partial<FormValues>>({
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

  const onSubmit = (
    values: FormValues,
    resetForm: (nextState?: Partial<FormikState<FormValues>>) => void
  ) => {
    if (sessionStore.user === undefined) return;

    sessionStore
      .updateUser(values, sessionStore.user.id)
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
  ) : (
    <S.Wrapper>
      {error !== undefined && (
        <Toast
          color="decline"
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
        {(formikBag) => <ChangePasswordForm {...formikBag} submitSuccess={submitSuccess} />}
      </Formik>
    </S.Wrapper>
  );
};

export default observer(ChangePassword);
