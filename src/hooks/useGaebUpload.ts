import { useState } from 'react';

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

  const handleSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append('tfx_id', '1');
    formData.append('file', file);
    setFile(file);
    setHideToast(false);
    setStatus(UPLOAD_STATES.UPLOADING);

    try {
      const response = await fetch(
        'https://vqf9tzwry7.execute-api.eu-central-1.amazonaws.com/test',
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
  };

  return {
    status,
    setStatus,
    hideToast,
    file,
    onClose,
    handleSubmit,
    UPLOAD_STATES,
  };
};
