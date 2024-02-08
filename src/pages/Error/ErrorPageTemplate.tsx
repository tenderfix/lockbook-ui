import { Button, designTheme } from '@abs-safety/lock-book-web-ui';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { layoutValues } from '../../templates/layoutValues';

interface ErrorPageTemplateProps {
  statusCode: number;
  headline: string;
  text: string;
  secondBtn?: {
    text: string;
    href: string;
  };
}

// Styled Components
const S = {
  Wrapper: styled.div`
    min-height: calc(100vh - ${layoutValues.header.height + layoutValues.footer.height}px);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${designTheme.color.primary};
  `,
  TextWrapper: styled.div`
    margin: 0 auto;
    max-width: 450px;
    width: 100%;
    color: white;
  `,
  Headline: styled.h1`
    color: rgba(10, 110, 93, 1);
  `,
  ContentWrapper: styled.div`
    max-width: 690px;
    width: 100%;
  `,
  Divider: styled.hr`
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    width: 250px;
    margin: 35px 0;
  `,
  ButtonWrapper: styled.div`
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  `,
};

const ErrorPageTemplate: FunctionComponent<ErrorPageTemplateProps> = (
  props: ErrorPageTemplateProps
) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.TextWrapper>
        <S.Headline>{props.statusCode}</S.Headline>
        <h2>{props.headline}</h2>
        <S.Divider />
        <p>{props.text}</p>
        <S.ButtonWrapper>
          <Button color={'white'} variant={'outline'} as={'a'} href={process.env.REACT_APP_HUB_URL}>
            {t('error.back_to_lock_book')}
          </Button>
          {props.secondBtn !== undefined && (
            <Button color={'white'} variant={'outline'} as={'a'} href={props.secondBtn.href}>
              {props.secondBtn.text}
            </Button>
          )}
        </S.ButtonWrapper>
      </S.TextWrapper>
    </S.Wrapper>
  );
};

export default ErrorPageTemplate;
