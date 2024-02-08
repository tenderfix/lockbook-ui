import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps, useLocation } from 'react-router-dom';
import { sessionStore } from '../session/session.store';

interface PrivateRouteProps extends RouteProps {
  // eslint-disable-next-line
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = (props: PrivateRouteProps) => {
  const { pathname, search } = useLocation();

  // if (sessionStore.isLoggedIn === false && sessionStore.isInitialized === true) {
  //   return <Redirect to={{ pathname: '/login', search: search }} />;
  // }

  // if (sessionStore.hasAcceptedLegal === false && pathname !== '/legal') {
  //   return <Redirect to={{ pathname: '/legal', search: search }} />;
  // }

  return <Route path={props.path} render={(routeProps) => <props.component {...routeProps} />} />;
};

export default observer(PrivateRoute);
