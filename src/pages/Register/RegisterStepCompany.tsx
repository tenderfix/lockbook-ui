import React, { FunctionComponent, useEffect, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { Button, Checkbox, FormControl } from '@abs-safety/lock-book-web-ui';
import FormInput from '../../components/FormInput';
import { observer } from 'mobx-react';
import * as Yup from 'yup';
import { getBooleanSchema, getStringSchema } from '../../constraints/constraints';
import { Trans, useTranslation } from 'react-i18next';
import { sessionStore } from '../../session/session.store';
import FormSelectCountry from '../../components/FormSelectCountry';
import { pageStore } from './store/page.store';
import { FormikHelpers } from 'formik/dist/types';
import Alert from '../../components/Alert';
import S from './S';
import IconABS from '../../assets/IconABS';
import FormGroup from '../../components/FormGroup';
import { Link } from 'react-router-dom';
import IndustrySelection from '../../components/IndustrySelection';

export type RegisterStepCompanyValues = {
  name: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  country: string;
  acceptedTermsOfService: boolean;
  industry: string;
};

interface RegisterStepCompanyProps {
  onSubmit: (
    values: RegisterStepCompanyValues,
    formikHelpers: FormikHelpers<RegisterStepCompanyValues>
  ) => void;
  formData: RegisterStepCompanyValues;
}

const sessionLanguage = sessionStore.locale.toUpperCase();

const RegisterStepCompany: FunctionComponent<RegisterStepCompanyProps> = (
  props: RegisterStepCompanyProps
) => {
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape<Partial<RegisterStepCompanyValues>>({})
  );

  useEffect(() => {
    setValidationSchema(
      Yup.object().shape<Partial<RegisterStepCompanyValues>>({
        name: getStringSchema('Company', 'name'),
        address1: getStringSchema('Company', 'address1'),
        address2: getStringSchema('Company', 'address2'),
        postcode: getStringSchema('Company', 'postcode'),
        city: getStringSchema('Company', 'city'),
        country: getStringSchema('Company', 'country'),
        industry: getStringSchema('Company', 'industry'),
        acceptedTermsOfService: getBooleanSchema('User', 'acceptedTermsOfService'),
      })
    );
  }, [sessionStore.constraints]);

  return (
    <Formik<RegisterStepCompanyValues>
      initialValues={props.formData}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      {(formikBag) => <ObservedForm2 {...formikBag} />}
    </Formik>
  );
};

type RegisterStepCompanyFormProps = FormikProps<RegisterStepCompanyValues>;

const RegisterStepCompanyForm: FunctionComponent<RegisterStepCompanyFormProps> = (
  props: RegisterStepCompanyFormProps
) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true}>
      <S.HeadlineWrapper>
        <span>{t('register.register')}</span>
        <S.RegularHeadline>&nbsp;- {t('register.step') + ' 1/3'}</S.RegularHeadline>
      </S.HeadlineWrapper>
      <S.ContentWrapper>
        <S.AccountNote>
          <IconABS />
          <Trans i18nKey="register.account_already_registered">
            <div>
              <h4>
                Schon länger dabei?
                <Link to="/login" style={{ marginLeft: '0.25rem' }}>
                  Hier anmelden
                </Link>
              </h4>
              <p>
                Nutze Dein bestehendes „ABS-Lock Book“-Konto einfach weiter.
                <br />
                Du musst Dich nicht neu registrieren!
              </p>
            </div>
          </Trans>
        </S.AccountNote>
        <>
          <FormInput label={t('form.company')} name="name" type="text" size="lg" />
          <FormControl size="lg">
            <IndustrySelection
              value={props.values.industry}
              error={props.errors.industry}
              touched={props.touched.industry}
              onChange={(industry) => props.setFieldValue('industry', industry)}
              onBlur={() => props.setFieldTouched('industry', true)}
              placeholder={t('form.choose_industry')}
            />
          </FormControl>
          <FormSelectCountry
            name="country"
            size="lg"
            label={t('form.country')}
            locale={sessionLanguage}
            errorMessage={props.errors.country}
            placeholder={t('form.choose_country')}
          />
          <FormGroup>
            <FormInput label={t('form.address1')} name="address1" type="text" size="lg" />
            <FormInput
              label={t('form.address2')}
              name="address2"
              type="text"
              size="lg"
              required={false}
            />
          </FormGroup>
          <FormGroup>
            <FormInput label={t('form.postcode')} name="postcode" type="text" size="lg" />
            <FormInput label={t('form.city')} name="city" type="text" size="lg" />
          </FormGroup>
          <FormControl>
            <>
              <Checkbox
                text={
                  <Trans i18nKey="form.terms_accept">
                    <span>Wenn du fortfährst, stimmst du unseren&nbsp;</span>
                    <a
                      href="https://info.lock-book.com/nutzungsbedingungen"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Nutzungsbedingungen
                    </a>
                    &nbsp;und unserer&nbsp;
                    <a
                      href="https://info.lock-book.com/impressum-datenschutz"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Datenschutzerklärung
                    </a>
                    <span>&nbsp;zu.</span>
                  </Trans>
                }
                name="acceptedTermsOfService"
                checked={props.values.acceptedTermsOfService as boolean}
                onChange={() => {
                  props.setFieldValue(
                    'acceptedTermsOfService',
                    !(props.values.acceptedTermsOfService as boolean)
                  );
                }}
                onBlur={() => {
                  props.setFieldTouched('acceptedTermsOfService', true);
                }}
                regularWeight
              />
              {props.touched.acceptedTermsOfService === true &&
                props.errors.acceptedTermsOfService !== undefined && (
                  <S.CheckboxError>{props.errors.acceptedTermsOfService}</S.CheckboxError>
                )}
            </>
          </FormControl>
        </>
        {props.status !== undefined && (
          <Alert type="danger" style={{ marginBottom: '1.875rem' }}>
            {props.status}
          </Alert>
        )}
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button type={'submit'} disabled={pageStore.waitingFor.getCompanyByName === true}>
          {t('form.next')}
        </Button>
      </S.ButtonWrapper>
    </Form>
  );
};

const ObservedForm2 = observer(RegisterStepCompanyForm);

export default observer(RegisterStepCompany);
