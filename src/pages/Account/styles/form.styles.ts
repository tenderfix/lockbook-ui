import { designTheme } from '@abs-safety/lock-book-web-ui';
import styled from 'styled-components';

export const StyledForm = {
  ContentWrapper: styled.div`
    margin-top: -15px;
  `,
  HeadlineWrapper: styled.h2`
    margin: 0 0 24px 0;
    padding-right: 20px;
    font-size: 32px;
    white-space: pre-wrap;
  `,
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: auto;
  `,
  Inline: styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 20px;
    margin-top: 30px;
  `,
  InnerForm: styled.div`
    margin-top: 50px;
  `,
  GreyText: styled.p`
    padding-top: 10px;
    color: ${designTheme.color.darkgrey};
    margin-bottom: 40px;
  `,
  SubmitButton: styled.div`
    text-align: right;

    button {
      margin-left: 1.875rem;
    }

    &.multibutton {
      margin-left: 0;
      display: flex;
      justify-content: space-between;
      button {
        margin-left: 0;
      }
    }
  `,
};
