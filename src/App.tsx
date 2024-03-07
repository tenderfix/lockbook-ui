import React, { FunctionComponent } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { designTheme, GlobalStyle, GlobalStyleResponsiveScale } from '@abs-safety/lock-book-web-ui';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';

import { sessionStore } from './session/session.store';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Legal from './pages/Legal/Legal';
import Login from './pages/Login/Login';
import Account from './pages/Account/Account';
import Logout from './pages/Logout/Logout';
import Register from './pages/Register/Register';
import Hub from './pages/Hub/Hub';
import Error404 from './pages/Error/Error404';
import Error500 from './pages/Error/Error500';
import { layoutValues } from './templates/layoutValues';
import NewPassword from './pages/NewPassword/NewPassword';
import AccountActivation from './pages/Register/AccountActivation';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import LoadingPage from './pages/LoadingPage/LoadingPage';
import PrivateRoute from './routing/PrivateRoute';
import RedirectWhenLoggedIn from './routing/RedirectWhenLoggedIn';
import { useLocale } from './hooks/useLocale';
import { useUser } from './hooks/useUser';
import { useReferrer } from './hooks/useReferrer';
import ResendAccountActivation from './pages/ResendAccountActivation/ResendAccountActivation';

const App: FunctionComponent = () => {
  useLocale();
  useUser();
  useReferrer();
  const { t } = useTranslation();

  const renderRoutes = () => {
    if (sessionStore.isInitialized === false && window.location.pathname !== '/login') {
      return <LoadingPage text={t('loading.general')} />;
    }

    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/services" />
        </Route>
        {/* Only Public */}
        <RedirectWhenLoggedIn path="/signup" component={Register} redirect="/services" />
        <RedirectWhenLoggedIn
          path="/forgot-password"
          component={ForgotPassword}
          redirect="/services"
        />
        <RedirectWhenLoggedIn
          path="/resend-account-activation"
          component={ResendAccountActivation}
          redirect="/services"
        />
        <RedirectWhenLoggedIn path="/new-password" component={NewPassword} redirect="/services" />
        <RedirectWhenLoggedIn
          path="/activate/:activationToken"
          component={AccountActivation}
          redirect="/services"
        />
        {/* Public */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        {/* Protected */}
        <PrivateRoute exact path="/services" component={Hub} />
        <PrivateRoute exact path="/legal" component={Legal} />
        <PrivateRoute path="/account" component={Account} />
        {/* 404 */}
        <Route path="*" component={Error404} />)
      </Switch>
    );
  };

  return (
    <ThemeProvider theme={{ theme: 'default' }}>
      <GlobalStyleResponsiveScale />
      <GlobalStyle />
      <Sentry.ErrorBoundary fallback={<Error500 />}>
        <Router>
          <ScrollToTop />
          <Header />
          <S.Content>{renderRoutes()}</S.Content>
          <Footer />
        </Router>
      </Sentry.ErrorBoundary>
    </ThemeProvider>
  );
};

export default observer(App);

// Styled Components
const S = {
  Content: styled.div`
    min-height: calc(100vh - ${layoutValues.header.height}px - ${layoutValues.footer.height}px);
    background-color: ${designTheme.color.lightestgrey};
    overflow: hidden;
  `,
};
