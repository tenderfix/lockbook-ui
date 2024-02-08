import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SpinnerSvg } from '../assets/spinner.svg';

type SpinnerProps = {
  size?: number;
};

const SpinnerContainer = styled.div<SpinnerProps>`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: rotate;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;

  @keyframes rotate {
    from {
      transform-origin: center;
      transform: rotate(0);
    }

    to {
      transform-origin: center;
      transform: rotate(360deg);
    }
  }
`;

const Spinner: React.FC<SpinnerProps> = ({ size = 18 }: SpinnerProps) => (
  <SpinnerContainer size={size}>
    <SpinnerSvg />
  </SpinnerContainer>
);

export default Spinner;
