import { useState, useEffect } from 'react';
import { accountApi } from '../pages/Account/api/account.api';
import { sessionStore } from '../session/session.store';
import { ICompanyRead } from '../entities/Company';
import { SuperPageStore } from '../utils/SuperPageStore';

export interface UPLOAD_STATES {
  INACTIVE: string;
  UPLOADING: string;
  ERROR: string;
  SUCCESS: string;
}

const UPLOAD_STATES: UPLOAD_STATES = {
  INACTIVE: 'INACTIVE',
  UPLOADING: 'UPLOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const useGaebUpload = () => {
  const [status, setStatus] = useState<string>(UPLOAD_STATES.INACTIVE);
  const [hideToast, setHideToast] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [companyInfo, setCompanyInfo] = useState<null | ICompanyRead>(null);
  const [invalidFormat, setInvalidFormat] = useState<boolean>(false);
  const [featureEnabled, setFeatureEnabled] = useState<boolean>(true);
  const allowedFormats = ['d83', 'p83', 'x83', 'D83', 'P83', 'X83'];

  const handleSubmit = async (file: File) => {
    setFile(file);
    setStatus(UPLOAD_STATES.INACTIVE);
    setInvalidFormat(false);
    console.log('file:', {
      file,
      format: file?.name?.split('.')[file?.name?.split('.').length - 1],
    });
    if (!allowedFormats.includes(file?.name?.split('.')[file?.name?.split('.').length - 1])) {
      setInvalidFormat(true);
      setHideToast(false);
      return;
    }
    const formData = new FormData();
    let companyInformation = companyInfo;
    if (!companyInfo)
      try {
        companyInformation = await accountApi.loadCompany(sessionStore?.user?.company?.id);
        setCompanyInfo(companyInformation);
      } catch (e) {
        companyInformation = null;
      }
    //Change to TFX_ID to "1" after testing
    formData.append('tfx_id', '1');
    formData.append('file', file);
    formData.append('company_name', sessionStore?.user?.company?.name ?? '');
    formData.append(
      'company_address',
      `${companyInformation?.address1 ?? ' '}
    ${companyInformation?.address2 ?? ''}
    ${companyInformation?.city ?? ''} ${companyInformation?.postcode ?? ''}
    `
    );
    formData.append(
      'user_name',
      `${sessionStore?.user?.firstName ?? ''} ${sessionStore?.user?.lastName}`
    );
    formData.append('user_email', `${sessionStore?.user?.email ?? ''}`);

    setHideToast(false);
    setStatus(UPLOAD_STATES.UPLOADING);

    try {
      const response = await fetch(
        'https://vqf9tzwry7.execute-api.eu-central-1.amazonaws.com/GAEB_to_mail_wrapper',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        setStatus(UPLOAD_STATES.SUCCESS);
        setHideToast(false);
        console.log('Uploaded', response);
      } else {
        setStatus(UPLOAD_STATES.ERROR);
        setHideToast(false);
        console.log('Error', response);
      }
    } catch (error) {
      setStatus(UPLOAD_STATES.ERROR);
      setHideToast(false);
      console.error('Error:', error);
    }
  };

  const onClose = () => {
    setHideToast(true);
    setInvalidFormat(false);
  };

  const checkIfFeatureEnabled = async () => {
    const featureId = 'tenderfix_gaeb_upload';
    const environmentId = process.env.REACT_APP_ENVIRONMENT;
    try {
      const res = await fetch(
        `https://api.configcat.com/v1/environments/${environmentId}/settings/${featureId}/value`,
        {
          headers: {
            'x-api-key': 'UxbbCE0xjEmBoODBkwE1iw/h0VVSM7juE6ZsGBJeVaimQ',
          },
        }
      );
      setFeatureEnabled(res?.value);
    } catch (e) {
      console.log('ConfigCat request failed');
    }
  };

  useEffect(() => {
    // checkIfFeatureEnabled();
  }, []);

  return {
    status,
    setStatus,
    hideToast,
    file,
    onClose,
    handleSubmit,
    invalidFormat,
    UPLOAD_STATES,
    featureEnabled,
  };
};
