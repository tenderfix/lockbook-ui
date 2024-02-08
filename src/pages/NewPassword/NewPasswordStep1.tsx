import { Button, designTheme } from '@abs-safety/lock-book-web-ui';
import { Form, Formik, FormikProps } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import { getStringSchema, getStringSchemaByConstraintType } from '../../constraints/constraints';
import { IUserCreate } from '../../entities/User';
import { sessionStore } from '../../session/session.store';

export type FormValues = Pick<IUserCreate, 'plainPassword' | 'repeatedPassword'>;

interface NewPasswordProps {
  onSubmit: (values: FormValues) => void;
}

const NewPasswordStep1: FunctionComponent<NewPasswordProps> = (props: NewPasswordProps) => {
  const { t } = useTranslation();

  const [initialValues] = useState<FormValues>({
    plainPassword: '',
    repeatedPassword: '',
  });

  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<FormValues>>({})
  );

  useEffect(() => {
    setValidationSchema(
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

  return isEmpty(sessionStore.constraints) ? (
    <p>{t('loading.general')}</p>
  ) : (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikBag) => <ObservedForm {...formikBag} />}
    </Formik>
  );
};

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
  RegularHeadline: styled.span`
    font-weight: normal;
  `,
  TextWrapper: styled.p`
    font-size: 15px;
    margin-bottom: 50px;

    a {
      text-decoration: none;
      font-weight: bold;
      color: ${designTheme.color.primary};
    }
  `,
  AccountNote: styled.div`
    background-color: ${designTheme.color.lightestgrey};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 25px;
    border-radius: ${designTheme.borderRadius};
    margin-bottom: 25px;

    svg {
      margin-right: 25px;
    }
  `,
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: auto;
    justify-content: space-between;
  `,
  FormInfo: styled.span`
    display: block;
    margin-top: -10px;
    font-size: 14px;
  `,
  LostAccountPopup: styled.div`
    text-align: left;
    a {
      color: #fff;
      text-decoration: underline;
    }
    p {
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
  `,
};

const NewPasswordStep1Form: FunctionComponent<FormikProps<FormValues>> = (
  props: FormikProps<FormValues>
) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <S.HeadlineWrapper>
        <span>{t('new_password.insert_password')}</span>
      </S.HeadlineWrapper>
      <S.ContentWrapper>
        <S.TextWrapper>{t('new_password.info')} </S.TextWrapper>
        <>
          <FormInput
            label={t('form.password_new')}
            placeholder={t('form.password_new_enter')}
            name="plainPassword"
            type="password"
            size="sm"
          />

          <FormInput
            label={t('form.password_repeat')}
            placeholder={t('form.password_new_repeat')}
            name="repeatedPassword"
            type="password"
            size="sm"
          />
        </>
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button disabled={!props.dirty || !props.isValid} type={'submit'}>
          {t('form.save')}
        </Button>
      </S.ButtonWrapper>
    </Form>
  );
};

const ObservedForm = observer(NewPasswordStep1Form);
export default observer(NewPasswordStep1);
