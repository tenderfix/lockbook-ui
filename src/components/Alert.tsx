import styled from 'styled-components';
import { designTheme } from '@abs-safety/lock-book-web-ui';

type AlertType = 'success' | 'danger';

type AlertProps = {
  type: AlertType;
};

const colors: Record<AlertType, string> = {
  success: designTheme.color.primary,
  danger: designTheme.color.error,
};

const Alert = styled.div`
  border: ${(props: AlertProps) => `2px solid ${colors[props.type]}`};
  padding: 10px;
  border-radius: 5px;
  color: ${(props: AlertProps) => colors[props.type]};
`;

Alert.displayName = 'Alert';

export default Alert;
