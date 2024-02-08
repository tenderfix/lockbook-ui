import { Button, designTheme } from '@abs-safety/lock-book-web-ui';
import React, { FunctionComponent, ReactNode } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import IconDesktop from '../assets/IconDesktop';
import IconMobile from '../assets/IconMobile';

interface HubCardProps {
  imageSrc: string;
  icon: ReactNode;
  title: string;
  description: string;
  readMore?: string;
  mobile: boolean;
  desktop: boolean;
  buttonText: string;
  buttonUrl: string;
  handleSubmit?: (file: File) => void;
  disabled?: boolean;
}

// Styled Components
const S = {
  HubCard: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    margin: 24px;
    color: #262626;
  `,
  CardContent: styled.div`
    background-color: #fff;
    box-shadow: 0 5px 50px rgba(0, 0, 0, 0.1);
  `,

  ImageWrapper: styled.div`
    height: 250px;
  `,
  Image: styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
  `,
  InformationWrapper: styled.div`
    display: flex;
    flex-direction: column;
    min-height: 340px;
    padding: 24px;
  `,
  Headline: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    padding-bottom: 24px;
  `,
  HeadlineTitle: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    text-align: left;
    width: 70%;
  `,
  HeadlineDevices: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 30%;
    opacity: 0.9;
  `,
  HeadlineIcon: styled.span`
    display: inline-block;
  `,
  HeadlineText: styled.h2`
    display: inline-block;
    vertical-align: center;
    margin-left: 8%;
  `,
  TextWrapper: styled.div`
    height: 100%;
  `,
  Description: styled.p`
    text-align: left;
    font-size: 18px;
  `,
  ReadMore: styled.p`
    text-align: left;
    margin-top: 10px;
    font-weight: bold;

    a {
      color: ${designTheme.color.black};

      &:hover {
        text-decoration: underline;
      }
    }
  `,
  Button: styled.div`
    align-self: flex-end;
    margin-top: auto; // set to bottom of container

    a:hover {
      text-decoration: none;
    }
  `,
  Input: styled.input`
    display: none;
  `,
};

const HubCard: FunctionComponent<HubCardProps> = (props: HubCardProps) => {
  const { t } = useTranslation();

  const inputRef = useRef(null);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    if (!file) return;
    if (props.handleSubmit) props.handleSubmit(file);
  };

  return (
    <S.HubCard>
      <S.CardContent>
        <S.Input ref={inputRef} type="file" onChange={handleFileSelect} />
        <S.ImageWrapper>
          <a href={props.buttonUrl}>
            <S.Image src={props.imageSrc} />
          </a>
        </S.ImageWrapper>
        <S.InformationWrapper>
          <S.Headline>
            <S.HeadlineTitle>
              <S.HeadlineIcon>{props.icon}</S.HeadlineIcon>
              <S.HeadlineText>{props.title}</S.HeadlineText>
            </S.HeadlineTitle>
            <S.HeadlineDevices>
              {props.desktop && <IconDesktop />}
              {props.mobile && (
                <span style={{ marginLeft: '6%' }}>
                  <IconMobile width={16} height={24} />
                </span>
              )}
            </S.HeadlineDevices>
          </S.Headline>
          <S.TextWrapper>
            <S.Description>{props.description}</S.Description>
            {props.readMore !== undefined && (
              <S.ReadMore>
                <a href={props.readMore}>{t('services.more_info')}</a>
              </S.ReadMore>
            )}
          </S.TextWrapper>
          <S.Button>
            {props.title !== 'GAEB' && (
              <Button as={'a'} href={props.buttonUrl}>
                {props.buttonText}
              </Button>
            )}
            {props.title === 'GAEB' && (
              <Button disabled={props.disabled} onClick={handleButtonClick}>
                {props.buttonText}
              </Button>
            )}
          </S.Button>
        </S.InformationWrapper>
      </S.CardContent>
    </S.HubCard>
  );
};

export default HubCard;
