import { useEffect } from 'react';
import { sessionStore } from '../session/session.store';
import { UnauthorizedError } from '../entities/ErrorResponse';
import { initDataLayer } from '../analytics';
import { ICompanyRead } from '../entities/Company';

export const useUser = (): void => {
  useEffect(() => {
    if (sessionStore.isLoggedIn === false) {
      console.log('UseUserCalled:returning', sessionStore);
      return;
    }
    console.log('UseUserCalled:continuing', sessionStore);
    if (sessionStore.isInitializing === true) {
      return;
    }

    (async () => {
      let user;
      try {
        user = await sessionStore.loadUser();
      } catch (error) {
        if (!(error instanceof UnauthorizedError)) {
          throw error;
        }
        return;
      } finally {
        if (user === undefined) {
          initDataLayer();
        } else {
          initDataLayer(user.id, (user.company as ICompanyRead).id);
        }
      }
      await sessionStore.hasAcceptedLatestLegalDocuments();
    })();
  }, [sessionStore.isLoggedIn]);
};
