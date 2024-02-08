import styled from 'styled-components';
import { layoutValues } from '../templates/layoutValues';

const FullHeightContainer = styled.div`
  position: relative;
  display: flex;
  height: calc(100vh - ${layoutValues.header.height}px - ${layoutValues.footer.height}px);
  flex-direction: column;
  overflow-y: auto;
`;

FullHeightContainer.displayName = 'FullHeightContainer';

export default FullHeightContainer;
