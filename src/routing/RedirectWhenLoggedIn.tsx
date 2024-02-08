import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps, useLocation } from 'react-router-dom';
import { sessionStore } from '../session/session.store';

interface RedirectWhenLoggedInProps extends RouteProps {
  // eslint-disable-next-line
  component: React.ComponentType<RouteComponentProps<any>>;
  redirect: string;
}

/**
 * A wrapper for <Route> that redirects to a specific page if the user is authenticated.
 */
const RedirectWhenLoggedIn: FunctionComponent<RedirectWhenLoggedInProps> = (
  props: RedirectWhenLoggedInProps
) => {
  const { search } = useLocation();

  if (sessionStore.isLoggedIn === true) {
    return <Redirect to={{ pathname: props.redirect, search: search }} />;
  }

  return <Route path={props.path} render={(routeProps) => <props.component {...routeProps} />} />;
};

export default observer(RedirectWhenLoggedIn);
