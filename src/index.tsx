import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { configure } from 'mobx';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/700.css';

if (process.env.REACT_APP_SENTRY_DSN !== '' && process.env.REACT_APP_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.npm_package_version,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  });
}

configure({
  enforceActions: 'always',
});

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
