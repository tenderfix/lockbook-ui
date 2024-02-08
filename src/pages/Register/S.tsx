import styled from 'styled-components';
import { designTheme } from '@abs-safety/lock-book-web-ui';

const S = {
  ContentWrapper: styled.div``,
  HeadlineWrapper: styled.h2`
    margin: 0 0 24px 0;
    padding-right: 20px;
    font-size: 32px;
    white-space: pre-wrap;
  `,
  RegularHeadline: styled.span`
    font-weight: normal;
  `,
  TextWrapper: styled.p`
    font-size: 15px;
    margin-bottom: 50px;

    a {
      text-decoration: none;
      font-weight: bold;
      color: ${designTheme.color.primary};
    }
  `,
  AccountNote: styled.div`
    background-color: ${designTheme.color.lightestgrey};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 25px;
    border-radius: ${designTheme.borderRadius};
    margin-bottom: 25px;

    svg {
      margin-right: 25px;
    }
  `,
  // TODO: This should be handled by web-ui.
  CheckboxError: styled.p`
    font-weight: 400;
    font-style: italic;
    font-size: 0.875rem;
    color: #b5131d;
    text-align: left;
  `,
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: auto;
    gap: 20px;
  `,
};

export default S;
