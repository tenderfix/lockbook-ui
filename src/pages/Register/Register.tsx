import { Toast } from '@abs-safety/lock-book-web-ui';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import { ConstraintViolationError } from '../../entities/ErrorResponse';
import { pageStore } from './store/page.store';
import CenteredCard from '../../components/CenteredCard';
import PageWithBackground from '../../components/PageWithBackground';
import { FormikHelpers } from 'formik/dist/types';
import { sessionStore } from '../../session/session.store';
import RegisterStepCompany, { RegisterStepCompanyValues } from './RegisterStepCompany';
import RegisterStepUser, { RegisterStepUserValues } from './RegisterStepUser';
import RegisterStepPassword, { RegisterStepPasswordValues } from './RegisterStepPassword';
import RegisterStepSuccess from './RegisterStepSuccess';
import { IUserCreate } from '../../entities/User';
import { useReferrer } from '../../hooks/useReferrer';

export const SIGNUP_STEP_COMPANY_PATH = '/signup/company';
export const SIGNUP_STEP_USER_PATH = '/signup/user';
export const SIGNUP_STEP_PASSWORD_PATH = '/signup/password';
export const SIGNUP_STEP_SUCCESS_PATH = '/signup/registered';

const Register: FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [referrer, landingPage] = useReferrer();
  const [company, setCompany] = useState<RegisterStepCompanyValues>({
    name: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    country: '',
    industry: '',
    acceptedTermsOfService: false,
  });
  const [user, setUser] = useState<RegisterStepUserValues>({
    firstName: '',
    lastName: '',
    phone1: '',
    email: '',
    jobTitle: '',
  });
  const [passwords, setPasswords] = useState<RegisterStepPasswordValues>({
    plainPassword: '',
    repeatedPassword: '',
  });
  const [error, toggleError] = useState<ConstraintViolationError | undefined>(undefined);

  const onSubmitStepCompany = (
    values: RegisterStepCompanyValues,
    formikHelpers: FormikHelpers<RegisterStepCompanyValues>
  ) => {
    pageStore
      .getCompanyByName(values)
      .then((company) => {
        if (isEmpty(company)) {
          setCompany(values);
          history.push(SIGNUP_STEP_USER_PATH);
          formikHelpers.setStatus(undefined);
        } else {
          formikHelpers.setStatus(t('register.company_error'));
        }
      })
      .catch((error) => {
        if (error instanceof ConstraintViolationError) {
          toggleError(error);
        }
      });
  };

  const onSubmitStepUser = (values: RegisterStepUserValues) => {
    history.push(SIGNUP_STEP_PASSWORD_PATH);
    setUser(values);
  };

  const onSubmitStepPassword = (values: RegisterStepPasswordValues) => {
    setPasswords(values);

    const userWithPasswords: IUserCreate = {
      ...user,
      ...values,
      acceptedTermsOfService: company.acceptedTermsOfService,
    };
    const formData = { ...company, users: [userWithPasswords], referrer, landingPage };

    pageStore
      .createCompany(formData)
      .then(() => history.push(SIGNUP_STEP_SUCCESS_PATH))
      .catch((error) => {
        if (error instanceof ConstraintViolationError) {
          toggleError(error);
        }
      });
  };

  if (isEmpty(sessionStore.constraints)) {
    return <p>{t('loading.general')}</p>;
  }

  return (
    <PageWithBackground title={t('register.register')}>
      {error !== undefined && (
        <Toast
          color="decline"
          offsetTop={65}
          title={error.payload.title}
          description={error.payload.violations[0].message}
          onCloseClick={() => toggleError(undefined)}
        />
      )}
      <Switch>
        <Redirect exact from="/signup" to={SIGNUP_STEP_COMPANY_PATH} />
        <Route path={SIGNUP_STEP_COMPANY_PATH}>
          <CenteredCard size="md">
            <RegisterStepCompany onSubmit={onSubmitStepCompany} formData={company} />
          </CenteredCard>
        </Route>
        <Route path={SIGNUP_STEP_USER_PATH}>
          <CenteredCard size="md">
            <RegisterStepUser onSubmit={onSubmitStepUser} formData={user} />
          </CenteredCard>
        </Route>
        <Route path={SIGNUP_STEP_PASSWORD_PATH}>
          <CenteredCard size="md">
            <RegisterStepPassword onSubmit={onSubmitStepPassword} formData={passwords} />
          </CenteredCard>
        </Route>
        <Route path={SIGNUP_STEP_SUCCESS_PATH}>
          <RegisterStepSuccess email={user.email} />
        </Route>
      </Switch>
    </PageWithBackground>
  );
};

export default observer(Register);
