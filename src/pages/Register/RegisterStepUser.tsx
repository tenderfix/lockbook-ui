import { Button, FormControl } from '@abs-safety/lock-book-web-ui';
import { Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import { getStringSchema, getStringSchemaByConstraintType } from '../../constraints/constraints';
import { sessionStore } from '../../session/session.store';
import JobTitleSelection from '../../components/JobTitleSelection';
import { SIGNUP_STEP_COMPANY_PATH } from './Register';
import S from './S';

export type RegisterStepUserValues = {
  lastName: string;
  firstName: string;
  phone1: string;
  email: string;
  jobTitle: string;
};

interface RegisterStepUserProps {
  onSubmit: (values: RegisterStepUserValues) => void;
  formData: RegisterStepUserValues;
}

const RegisterStepUser: FunctionComponent<RegisterStepUserProps> = (
  props: RegisterStepUserProps
) => {
  const { t } = useTranslation();
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({}));

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape({
        lastName: getStringSchema('User', 'lastName'),
        firstName: getStringSchema('User', 'firstName'),
        phone1: getStringSchema('User', 'phone1'),
        email: getStringSchema('User', 'email'),
        repeatedEmail: getStringSchemaByConstraintType('User', 'repeatedEmail', 'NotBlank').test(
          'repeatedEmail',
          t('form.email_matching'),
          function (value) {
            return this.parent.email === value;
          }
        ),
        jobTitle: getStringSchema('User', 'jobTitle'),
      })
    );
  }, [sessionStore.constraints]);

  return (
    <Formik<RegisterStepUserValues>
      initialValues={props.formData}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikBag) => <ObservedForm1 {...formikBag} />}
    </Formik>
  );
};

const RegisterStepUserForm: FunctionComponent<FormikProps<RegisterStepUserValues>> = (
  props: FormikProps<RegisterStepUserValues>
) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Form noValidate={true}>
      <S.HeadlineWrapper>
        <span>{t('register.register')}</span>
        <S.RegularHeadline>&nbsp;- {t('register.step') + ' 2/3'}</S.RegularHeadline>
      </S.HeadlineWrapper>
      <S.ContentWrapper>
        <>
          <FormInput label={t('form.firstname')} name="firstName" type="text" size="lg" />
          <FormInput label={t('form.lastname')} name="lastName" type="text" size="lg" />
          <FormInput label={t('form.phone')} name="phone1" type="text" size="lg" required={false} />
          <FormInput label={t('form.email')} name="email" type="text" size="lg" />
          <FormInput label={t('form.email_repeat')} name="repeatedEmail" type="text" size="lg" />
          <FormControl size="lg">
            <JobTitleSelection
              value={props.values.jobTitle}
              error={props.errors.jobTitle}
              touched={props.touched.jobTitle}
              onChange={(jobTitle) => props.setFieldValue('jobTitle', jobTitle)}
              onBlur={() => props.setFieldTouched('jobTitle', true)}
              placeholder={t('form.choose_job_title')}
            />
          </FormControl>
        </>
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button type={'submit'}>{t('form.next')}</Button>
        <Button
          type={'button'}
          onClick={() => history.push(SIGNUP_STEP_COMPANY_PATH)}
          color={'black'}
          variant={'text'}
        >
          {t('form.back_to_step') + ' 1'}
        </Button>
      </S.ButtonWrapper>
    </Form>
  );
};

const ObservedForm1 = observer(RegisterStepUserForm);

export default observer(RegisterStepUser);
