import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import CenteredCard from '../../components/CenteredCard';
import Spinner from '../../components/Spinner';
import PageWithBackground from '../../components/PageWithBackground';

interface LoadingPageProps {
  text: string;
}

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  // Text should appear centered, but card has weird bigger top spacing.
  margin-bottom: 26px;

  span {
    margin-left: 0.25rem;
  }
`;

const LoadingPage: FunctionComponent<LoadingPageProps> = (props: LoadingPageProps) => (
  <PageWithBackground title={props.text}>
    <CenteredCard size="sm">
      <Content>
        <Spinner />
        <span>{props.text}</span>
      </Content>
    </CenteredCard>
  </PageWithBackground>
);

export default LoadingPage;
