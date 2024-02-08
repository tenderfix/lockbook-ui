import { Button, Checkbox, designTheme } from '@abs-safety/lock-book-web-ui';
import { Form, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import FormInput from '../../../components/FormInput';
import { sessionStore } from '../../../session/session.store';
import { FormValues } from './Profile';
import FormGroup from '../../../components/FormGroup';

interface ProfileFormProps extends FormikProps<FormValues> {
  /** show that updating the Profile was successful */
  submitSuccess?: boolean;
}

const S = {
  AccountInformation: styled.div`
    margin-top: 30px;
  `,
  ProfileInformation: styled.div`
    margin-top: 0.625rem;
  `,
  DescriptionText: styled.p`
    padding-top: 10px;
    padding-bottom: 30px;
    color: ${designTheme.color.darkgrey};
  `,
  Privacy: styled.div`
    margin-top: 40px;
    margin-bottom: 20px;
    a {
      font-weight: bold;
    }
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
};

const ProfileForm: FunctionComponent<ProfileFormProps> = (props: ProfileFormProps) => {
  const { t } = useTranslation();

  return (
    <Form noValidate={true}>
      <h3>{t('profile.my_profile')}</h3>
      <S.AccountInformation>
        <FormGroup>
          <FormInput label={t('form.username')} name="username" type="text" readOnly={true} />
          <FormInput label={t('form.company')} name="company" type="text" readOnly={true} />
        </FormGroup>
      </S.AccountInformation>
      <S.ProfileInformation>
        <FormInput label={t('form.firstname')} name="firstName" type="text" size="lg" />
        <FormInput label={t('form.lastname')} name="lastName" type="text" size="lg" />
        <FormInput label={t('form.phone')} name="phone1" type="text" size="lg" required={false} />
        <FormInput label={t('form.email')} name="email" type="text" size="lg" />
      </S.ProfileInformation>
      <div>
        <h4>{t('profile.newsletter.title')}</h4>
        <S.DescriptionText>{t('profile.newsletter.description')}</S.DescriptionText>
        <Checkbox
          name="acceptedLockBookNewsletter"
          text={t('profile.newsletter.newsletter_accept')}
          checked={props.values.acceptedLockBookNewsletter as boolean}
          onChange={() => {
            props.setFieldValue(
              'acceptedLockBookNewsletter',
              !(props.values.acceptedLockBookNewsletter as boolean)
            );
          }}
        />
      </div>
      <S.Privacy>
        <h4>{t('profile.privacy.title')}</h4>
        <S.DescriptionText>{t('profile.privacy.description')}</S.DescriptionText>
        <p>
          <Trans i18nKey="profile.privacy.link">
            Hier kannst Du die aktuellste
            <a
              href="https://info.lock-book.com/impressum-datenschutz"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutzerklärung einsehen
            </a>
          </Trans>
        </p>
      </S.Privacy>
      {props.submitSuccess === true && !props.dirty && (
        <S.Success>
          <h5>{t('form.success')}</h5>
        </S.Success>
      )}
      <S.SubmitButton>
        <Button
          disabled={!props.dirty || sessionStore.waitingFor.updateUser === true}
          type={'submit'}
        >
          {t('form.submit')}
        </Button>
      </S.SubmitButton>
    </Form>
  );
};

export default observer(ProfileForm);
