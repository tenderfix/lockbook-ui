import { Toast } from '@abs-safety/lock-book-web-ui';
import { Formik, FormikState } from 'formik';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { getStringSchema } from '../../../constraints/constraints';
import { ICompanyLogoWrite, ICompanyRead, ICompanyWrite } from '../../../entities/Company';
import { ConstraintViolationError } from '../../../entities/ErrorResponse';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';
import CompanyDataForm from './CompanyDataForm';
import CompanyLogoForm from './CompanyLogoForm';

// form values for company data
export type DataFormValues = Pick<
  ICompanyWrite,
  'name' | 'address1' | 'address2' | 'postcode' | 'city' | 'country' | 'industry'
>;

// Styled Components
const S = {
  FormWrapper: styled.div`
    display: flex;
  `,
  DataForm: styled.div`
    max-width: 690px;
    flex-grow: 1;
  `,
  LogoForm: styled.div`
    margin-left: 50px;
    width: 160px;
  `,
};
// form values for company logo
export type LogoFormValues = Pick<ICompanyLogoWrite, 'imageFile'>;

const dataValidationSchema = Yup.object().shape<Partial<ICompanyRead>>({
  name: getStringSchema('Company', 'name'),
  address1: getStringSchema('Company', 'address1'),
  address2: getStringSchema('Company', 'address2'),
  postcode: getStringSchema('Company', 'postcode'),
  city: getStringSchema('Company', 'city'),
  industry: getStringSchema('Company', 'industry'),
  country: getStringSchema('Company', 'country'),
});

const logoValidationSchema = Yup.object().shape<Partial<LogoFormValues>>({
  imageFile: getStringSchema('Company', 'imageFile'),
});

const Company: FunctionComponent = () => {
  const { t } = useTranslation();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, toggleError] = useState<ConstraintViolationError | undefined>(undefined);

  useEffect(() => {
    const companyId = sessionStore.user?.company?.id;

    if (companyId === undefined) {
      return;
    }

    pageStore.loadCompany(companyId);
  }, [sessionStore.user?.company?.id]);

  const onDataSubmit = (
    valuesData: ICompanyRead | undefined,
    resetForm: (nextState?: Partial<FormikState<ICompanyRead>>) => void
  ) => {
    if (valuesData === undefined) return;

    pageStore
      .updateCompany(valuesData, valuesData.id)
      .then(() => {
        resetForm({});
        setSubmitSuccess(true);
      })
      .catch((err) => {
        if (err instanceof ConstraintViolationError) toggleError(err);
        setSubmitSuccess(false);
      });
  };

  if (isEmpty(sessionStore.constraints)) {
    return <p>{t('loading.general')}</p>;
  }
  if (pageStore.company === undefined) {
    return <p>{t('company.not_found')}</p>;
  }

  const initialValues: ICompanyRead = {
    id: pageStore.company.id,
    imageFilename: pageStore.company.imageFilename,
    industry: pageStore.company.industry,
    imageFile: pageStore.company.imageFile,
    address1: pageStore.company.address1 ?? '',
    address2: pageStore.company.address2 ?? '',
    city: pageStore.company.city ?? '',
    country: pageStore.company.country ?? '',
    imageUrl: pageStore.company.imageUrl ?? '',
    name: pageStore.company.name ?? '',
    postcode: pageStore.company.postcode ?? '',
  };

  return (
    <>
      {error !== undefined && (
        <Toast
          color="decline"
          title={error.payload.title}
          description={error.payload.violations[0].message}
          onCloseClick={() => toggleError(undefined)}
        />
      )}
      <S.FormWrapper>
        <S.DataForm>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={dataValidationSchema}
            onSubmit={(valuesData, { resetForm }) => {
              onDataSubmit(valuesData, resetForm);
            }}
          >
            {(formikBag) => <CompanyDataForm {...formikBag} submitSuccess={submitSuccess} />}
          </Formik>
        </S.DataForm>
        <S.LogoForm>
          <Formik
            initialValues={initialValues}
            enableReinitialize={false}
            validationSchema={logoValidationSchema}
            // we do not have an onSubmit here
            onSubmit={function () {
              return;
            }}
          >
            {(formikBag) => <CompanyLogoForm {...formikBag} />}
          </Formik>
        </S.LogoForm>
      </S.FormWrapper>
    </>
  );
};

export default observer(Company);
