import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import styled from 'styled-components';
import Error403 from '../pages/Error/Error403';
import { sessionStore } from '../session/session.store';
import { layoutValues } from '../templates/layoutValues';

interface AdminRouteProps extends RouteProps {
  // eslint-disable-next-line
  component: React.ComponentType<RouteComponentProps<any>>;
}

const S = {
  FullPage: styled.div`
    position: absolute;
    z-index: 90;
    top: ${layoutValues.header.height}px;
    left: 0;
    width: 100vw;
    min-height: calc(100vh - ${layoutValues.header.height + layoutValues.footer.height}px);
  `,
};

/**
 * A wrapper for <Route /> that protects routes only visible for admins.
 */
const AdminRoute: FunctionComponent<AdminRouteProps> = (props: AdminRouteProps) => {
  if (sessionStore.isAdmin === false) {
    return (
      <S.FullPage>
        <Error403 />
      </S.FullPage>
    );
  }

  return <Route path={props.path} render={(routeProps) => <props.component {...routeProps} />} />;
};

export default observer(AdminRoute);
