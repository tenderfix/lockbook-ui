import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface MainPageProps {
  title: string;
  children: React.ReactNode;
}

// Styled Components
const S = {
  Component: styled.div`
    width: 1440px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 80px;
    @media (max-width: 1500px) {
      width: 100%;
      padding-left: 30px;
      padding-right: 30px;
    }
    @media (max-width: 1200px) {
      width: 100%;
      padding-left: 15px;
      padding-right: 15px;
    }
  `,
  Title: styled.h1`
    margin: 60px 0 40px 0;
  `,
};

const MainPage: FunctionComponent<MainPageProps> = (props: MainPageProps) => {
  useDocumentTitle(props.title);

  return (
    <S.Component>
      <S.Title>{props.title}</S.Title>
      {props.children}
    </S.Component>
  );
};

export default MainPage;
