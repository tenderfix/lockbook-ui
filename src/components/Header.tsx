import { Button, IconArrowDown, IconArrowUp } from '@abs-safety/lock-book-web-ui';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { sessionStore } from '../session/session.store';
import {
  LockBookHeader,
  DropdownHeader,
  DropdownHeaderItem,
  LockBookHeaderProps,
} from '@abs-safety/lock-book-header';
import { useTranslation } from 'react-i18next';
import { LOCALE_TO_LANGUAGE_MAP, Locales } from '../i18n/locales';

const Header: FunctionComponent = () => {
  const { i18n, t } = useTranslation();
  const history = useHistory();

  return (
    <LockBookHeader
      application="other"
      environment={process.env.REACT_APP_ENVIRONMENT as LockBookHeaderProps['environment']}
      locale={sessionStore.locale as LockBookHeaderProps['locale']}
      onLogoClick={() => history.push('/services')}
      user={
        sessionStore.user !== undefined
          ? {
              username: sessionStore.user.username ?? '',
              firstname: sessionStore.user.firstName ?? '',
              lastname: sessionStore.user.lastName ?? '',
              company: sessionStore.user.company?.name ?? '',
            }
          : undefined
      }
      customNodesRight={
        <div style={{ zIndex: 100 }}>
          <DropdownHeader
            title={t('header.language')}
            toggleNode={
              <Button variant="outline" color="white" size="small" icon={<IconArrowDown />}>
                {sessionStore.locale.toUpperCase()}
              </Button>
            }
            toggleNodeWhenOpened={
              <Button variant="outline" color="white" size="small" icon={<IconArrowUp />}>
                {sessionStore.locale.toUpperCase()}
              </Button>
            }
            dropdownAlign="right"
            offsetY={42}
            offsetX={-24}
          >
            {Locales.map((locale) => (
              <DropdownHeaderItem
                key={locale}
                text={LOCALE_TO_LANGUAGE_MAP[locale]}
                onClick={() => {
                  i18n.changeLanguage(locale);
                  sessionStore.applyLocale(locale);
                }}
                disabled={sessionStore.locale === locale}
              />
            ))}
          </DropdownHeader>
        </div>
      }
    />
  );
};

export default observer(Header);
