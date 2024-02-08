import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { layoutValues } from '../templates/layoutValues';

interface FullBackgroundImageProps {
  readonly image: string;
}

const S = {
  BackgroundImage: styled.div<FullBackgroundImageProps>`
    position: absolute;
    width: 100%;
    height: calc(100vh - ${layoutValues.header.height}px - ${layoutValues.footer.height}px);
    background: ${(props) => `url(${props.image})`};
    background-size: cover;
    z-index: 0; // always keep in background
    pointer-events: none;
  `,
};

const FullBackgroundImage: FunctionComponent<FullBackgroundImageProps> = (
  props: FullBackgroundImageProps
) => {
  return <S.BackgroundImage image={props.image} />;
};

export default FullBackgroundImage;
