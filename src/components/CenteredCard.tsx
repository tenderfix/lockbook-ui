import styled from 'styled-components';

const widths = {
  sm: '510px',
  md: '750px',
  lg: '990px',
};

type CenteredCardProps = {
  size: 'sm' | 'md' | 'lg';
};

const CenteredCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: center;
  margin: auto;
  padding: 56px 30px 30px 30px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: ${(props: CenteredCardProps) => widths[props.size]};
`;

CenteredCard.displayName = 'CenteredCard';

const CardHeader = styled.div`
  margin-bottom: 30px;
`;

CardHeader.displayName = 'CardHeader';

const CardFooter = styled.div`
  margin-top: 30px;
`;

CardFooter.displayName = 'CardFooter';

export { CardHeader, CardFooter };

export default CenteredCard;
