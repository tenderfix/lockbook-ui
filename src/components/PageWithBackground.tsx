import React, { FunctionComponent } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import FullHeightContainer from './FullHeightContainer';
import FullBackgroundImage from './FullBackgroundImage';

interface PageWithBackgroundProps {
  title: string;
  children: React.ReactNode;
}

const PageWithBackground: FunctionComponent<PageWithBackgroundProps> = (
  props: PageWithBackgroundProps
) => {
  useDocumentTitle(props.title);

  return (
    <>
      <FullBackgroundImage image={'/background@2x.jpg'} />
      <FullHeightContainer>{props.children}</FullHeightContainer>
    </>
  );
};

export default PageWithBackground;
