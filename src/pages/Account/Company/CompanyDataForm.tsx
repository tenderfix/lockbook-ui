import { Button, designTheme, FormControl } from '@abs-safety/lock-book-web-ui';
import { Form, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import FormGroup from '../../../components/FormGroup';
import FormInput from '../../../components/FormInput';
import FormSelectCountry from '../../../components/FormSelectCountry';
import IndustrySelection from '../../../components/IndustrySelection';
import { ICompanyRead } from '../../../entities/Company';
import { sessionStore } from '../../../session/session.store';
import { pageStore } from '../store/page.store';

interface CompanyFormProps extends FormikProps<ICompanyRead> {
  /** show that updating the Company was successful */
  submitSuccess?: boolean;
}

const sessionLanguage = sessionStore.locale.toUpperCase();

const CompanyDataForm: FunctionComponent<CompanyFormProps> = (props: CompanyFormProps) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true}>
      <h3>{t('company.my_company')}</h3>
      <S.Content>
        <FormInput label={t('form.name')} name="name" type="text" size="lg" />
        <FormInput label={t('form.address1')} name="address1" type="text" size="lg" />
        <FormInput
          label={t('form.address2')}
          name="address2"
          type="text"
          size="lg"
          required={false}
        />
        <FormGroup>
          <FormInput label={t('form.postcode')} name="postcode" type="text" size="lg" />
          <FormInput label={t('form.city')} name="city" type="text" size="lg" />
        </FormGroup>
        <FormSelectCountry
          name={'country'}
          size="lg"
          label={t('form.country')}
          locale={sessionLanguage}
          errorMessage={props.errors.country}
          placeholder={t('form.choose_country')}
        />
        <FormControl size="sm">
          <IndustrySelection
            value={props.values.industry}
            error={props.errors.industry}
            touched={props.touched.industry}
            onChange={(industry) => props.setFieldValue('industry', industry)}
            onBlur={() => props.setFieldTouched('industry', true)}
            placeholder={t('form.choose_industry')}
          />
        </FormControl>
        {props.submitSuccess === true && !props.dirty && (
          <S.Success>
            <h5>{t('form.success')}</h5>
          </S.Success>
        )}
        <S.SubmitButton>
          <Button
            disabled={!props.dirty || pageStore.waitingFor.updateCompany === true}
            type={'submit'}
          >
            {t('form.submit')}
          </Button>
        </S.SubmitButton>
      </S.Content>
    </Form>
  );
};

export default observer(CompanyDataForm);

const S = {
  Content: styled.div`
    margin-top: 30px;
  `,
  SubmitButton: styled.div`
    text-align: right;
  `,
  Success: styled.div`
    display: block;
    border: 2px solid ${designTheme.color.primary};
    margin-bottom: 30px;
    padding: 10px;
    border-radius: 5px;

    h5 {
      color: ${designTheme.color.primary};
    }
  `,
  ImageWrapper: styled.div`
    text-align: center;
  `,
  CropImage: styled.div`
    width: 90px;
    height: 90px;
    border-radius: 200px;
    overflow: hidden;
  `,
};
