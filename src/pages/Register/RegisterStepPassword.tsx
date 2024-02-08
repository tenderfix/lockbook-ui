import { Button } from '@abs-safety/lock-book-web-ui';
import { Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import { getStringSchema, getStringSchemaByConstraintType } from '../../constraints/constraints';
import { sessionStore } from '../../session/session.store';
import { pageStore } from './store/page.store';
import { SIGNUP_STEP_USER_PATH } from './Register';
import S from './S';

export type RegisterStepPasswordValues = {
  plainPassword: string;
  repeatedPassword: string;
};

interface RegisterStepPasswordProps {
  onSubmit: (values: RegisterStepPasswordValues) => void;
  formData: RegisterStepPasswordValues;
}

const RegisterStepPassword: FunctionComponent<RegisterStepPasswordProps> = (
  props: RegisterStepPasswordProps
) => {
  const { t } = useTranslation();
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<RegisterStepPasswordValues>>({})
  );

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape<Partial<RegisterStepPasswordValues>>({
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

  return (
    <Formik<RegisterStepPasswordValues>
      initialValues={props.formData}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikBag) => <ObservedForm3 {...formikBag} />}
    </Formik>
  );
};

type RegisterStepPasswordFormProps = FormikProps<RegisterStepPasswordValues>;

const RegisterStepPasswordForm: FunctionComponent<RegisterStepPasswordFormProps> = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Form noValidate={true}>
      <S.HeadlineWrapper>
        <span>{t('register.register')}</span>
        <S.RegularHeadline>&nbsp;- {t('register.step') + ' 3/3'}</S.RegularHeadline>
      </S.HeadlineWrapper>{' '}
      <S.ContentWrapper>
        <S.TextWrapper>
          <p>{t('form.password_hint')} </p>
        </S.TextWrapper>
        <>
          <FormInput label={t('form.password')} name="plainPassword" type="password" size="lg" />
          <FormInput
            label={t('form.password_repeat')}
            placeholder={t('form.password_repeat')}
            name="repeatedPassword"
            type="password"
            size="lg"
          />
        </>
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button type={'submit'} disabled={pageStore.waitingFor.createCompany === true}>
          {t('form.register')}
        </Button>
        <Button
          type={'button'}
          onClick={() => history.push(SIGNUP_STEP_USER_PATH)}
          color={'black'}
          variant={'text'}
        >
          {t('form.back_to_step') + ' 2'}
        </Button>
      </S.ButtonWrapper>
    </Form>
  );
};

const ObservedForm3 = observer(RegisterStepPasswordForm);

export default observer(RegisterStepPassword);
