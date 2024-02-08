import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ButtonProps, Button } from '@abs-safety/lock-book-web-ui';
import CenteredCard from './CenteredCard';

interface StatusDialogProps {
  type: 'success' | 'error';
  headline: string;
  text: string | React.ReactElement;
  additionalText?: string | React.ReactElement;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
}

export const StatusDialog: FunctionComponent<StatusDialogProps> = (props: StatusDialogProps) => (
  <CenteredCard size="sm">
    <S.ContentWrapper>
      <S.ImageWrapper>
        {props.type === 'error' ? (
          <img src={'/error.svg'} alt="" />
        ) : (
          <img src={'/checkmark.svg'} alt="" />
        )}
      </S.ImageWrapper>
      <S.Headline>{props.headline}</S.Headline>
      <S.Text>{props.text}</S.Text>
      {props.additionalText !== undefined && (
        <S.AdditionalTextWrapper>
          <S.Text>{props.additionalText}</S.Text>
        </S.AdditionalTextWrapper>
      )}
    </S.ContentWrapper>
    <S.ButtonWrapper {...props}>
      <Button {...props.primaryButton} />
      {props.secondaryButton !== undefined && <Button {...props.secondaryButton} />}
    </S.ButtonWrapper>
  </CenteredCard>
);

const S = {
  ContentWrapper: styled.div`
    display: flex;
    flex-direction: column;
  `,
  Headline: styled.h2`
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: left;
  `,
  Text: styled.p`
    font-size: 16px !important;
    line-height: 19px !important;
    text-align: left;
  `,
  AdditionalTextWrapper: styled.span`
    margin-top: 20px;
  `,
  ImageWrapper: styled.div`
    max-width: 140px;
    margin: 0 auto;
  `,
  ButtonWrapper: styled.div<StatusDialogProps>`
    display: flex;
    flex-direction: row-reverse;
    margin-top: 50px;

    button:last-child {
      margin-right: ${(props) => (props.secondaryButton !== undefined ? '20px' : '0px')};
    }
  `,
};
