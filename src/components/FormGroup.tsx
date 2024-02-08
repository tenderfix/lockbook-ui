import styled from 'styled-components';

interface FormGroupProps {
  /** flex value of the 1. child */
  child1Flex?: string;
  /** flex value of the 2. child */
  child2Flex?: string;
  /** flex value of the 3. child */
  child3Flex?: string;
}

/**
 * A simple Styled Component as a Wrapper for `<FormControl>s`, when they
 * should be placed horizontally next to each other.
 * You can pass the CSS flex value for the children as props, to define
 * the horizontal width the `<FormControl>`s should get.
 */
const FormGroup = styled.div<FormGroupProps>`
  display: flex;
  > div:not(:last-of-type) {
    margin-right: 30px;
  }
  > div:nth-of-type(1) {
    flex: ${(props) => props.child1Flex};
  }
  > div:nth-of-type(2) {
    flex: ${(props) => props.child2Flex};
  }
  > div:nth-of-type(3) {
    flex: ${(props) => props.child3Flex};
  }
`;

export default FormGroup;
