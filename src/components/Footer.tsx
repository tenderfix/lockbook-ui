import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { designTheme } from '@abs-safety/lock-book-web-ui';
import { layoutValues } from '../templates/layoutValues';
import { useTranslation } from 'react-i18next';

// Styled Components
const S = {
  Footer: styled.div`
    position: relative;
    z-index: 100;
    width: 100%;
    height: ${layoutValues.footer.height}px;
    color: white;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${designTheme.color.lightestgrey};

    ul {
      width: 100%;
      padding: 0;
      list-style: none;
      display: flex;
      color: ${designTheme.color.black};
      justify-content: flex-end;

      a {
        color: ${designTheme.color.black};
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `,
};

const Footer: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <S.Footer>
      <ul>
        <li>
          <a href="https://support.lock-book.com" target="_blank" rel="noreferrer">
            {t('footer.help')}
          </a>
          <span> /&nbsp;</span>
        </li>
        <li>
          <a
            href="https://info.lock-book.com/impressum-datenschutz"
            target="_blank"
            rel="noreferrer"
          >
            {t('footer.imprint_and_privacy')}
          </a>
          <span> /&nbsp;</span>
        </li>
        <li>
          <a href="https://info.lock-book.com/nutzungsbedingungen" target="_blank" rel="noreferrer">
            {t('footer.terms')}
          </a>
        </li>
      </ul>
    </S.Footer>
  );
};

export default Footer;
