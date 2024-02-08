import {
  designTheme,
  Dropdown,
  IconEdit,
  IconPlaceholder,
  IconTrash,
} from '@abs-safety/lock-book-web-ui';
import { Form, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import FormAutoSubmit from '../../../components/FormAutoSubmit';
import { ICompanyRead } from '../../../entities/Company';
import { pageStore } from '../store/page.store';

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
    margin-top: 30px;
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
    background-color: ${designTheme.color.lightgrey};
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `,
  HideInput: styled.div`
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  `,
  IconWrapper: styled.div`
    position: relative;
  `,
  IconEdit: styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 22px;
    height: 22px;
    border-radius: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${designTheme.color.grey};
  `,
};

const CompanyLogoForm: FunctionComponent<FormikProps<ICompanyRead>> = () => {
  const { t } = useTranslation();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }
    onFilesSelectedToUpload(Array.from(event.target.files));
    event.target.value = '';
  };

  const onFilesSelectedToUpload = (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    if (validateFiles(files) && pageStore.company !== undefined) {
      pageStore
        .uploadFile(pageStore.company.id, files[0])
        .then(() => {
          setSubmitSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          setSubmitSuccess(false);
        });
    }
  };

  const validateFiles = (files: FileList | File[]) => {
    if (files.length > 1) {
      console.error(`Es kann nur eine Datei ausgewählt werden`);
      return false;
    }

    return true;
  };

  return (
    <Form>
      <S.ImageWrapper>
        <Dropdown
          items={[
            {
              icon: <IconEdit />,
              onClick: function noRefCheck() {
                const element: HTMLElement = document.getElementById('uploadLogo') as HTMLElement;
                element.click();
              },
              text: t('form.edit'),
            },
            {
              icon: <IconTrash />,
              onClick: function noRefCheck() {
                if (pageStore.company !== undefined) {
                  pageStore.removeFile(pageStore.company.id);
                }
              },
              text: t('form.delete'),
              textColor: designTheme.color.error,
            },
          ]}
          width={'200px'}
          dropdownAlign={'right'}
          toggleNode={
            <S.IconWrapper>
              <S.IconEdit>
                <IconEdit width={11} height={11} />
              </S.IconEdit>
              <S.CropImage>
                {pageStore.company?.imageUrl !== null &&
                pageStore.company?.imageUrl !== undefined ? (
                  <img src={pageStore.company.imageUrl} alt="dummy" />
                ) : (
                  <IconPlaceholder width={55} height={44} color={designTheme.color.darkgrey} />
                )}
              </S.CropImage>
            </S.IconWrapper>
          }
        />

        <S.HideInput>
          <input type="file" name="imageFile" onChange={onFileInputChange} id={'uploadLogo'} />
        </S.HideInput>
        {submitSuccess && (
          <S.Success>
            <h5>{t('form.success_logo')}</h5>
          </S.Success>
        )}
        <FormAutoSubmit />
      </S.ImageWrapper>
    </Form>
  );
};
export default observer(CompanyLogoForm);
