import { sessionStore } from '../session/session.store';
import {
  ConstraintViolationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../entities/ErrorResponse';

const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * fetch util for normal requests
 *
 * @template T the response type of this request
 * @param method 'GET'|'POST'|....
 * @param route without apiEndpoint starting from '/'
 * @param body optional; a simple object; don't define if method: 'GET'
 */
export const fetchNormal = <T>(
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE',
  route: string,
  body?: Record<string, unknown>,
  params?: string
): Promise<T> => {
  const request: RequestInit = {
    method,
    headers,
    mode: 'cors',
    credentials: 'include',
  };

  if (body !== undefined) {
    request.body = JSON.stringify(body);
  }

  const query =
    params !== undefined
      ? `?${params}&locale=${sessionStore.locale}`
      : `?locale=${sessionStore.locale}`;
  const url = process.env.REACT_APP_API_URL + route + query;
  console.log('Sending Request:', request, body, query, url);
  return fetch(url, request)
    .then((response) => {
      // check if user needs to be reauthenticated
      if (response.status === 401 && route !== '/login') {
        return fetchRefresh().then((ok) => {
          if (!ok) {
            sessionStore.logout();
            throw new UnauthorizedError('Token expired.');
          }
          return fetch(url, request);
        });
      }
      return response;
    })
    .then((response) => {
      if (response.status === 204) {
        // no content, so response.json() would fail
        return response.text();
      }

      return response.json().then((body) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              // body contains information about violated fields
              throw new ConstraintViolationError(response.statusText, body);
            case 401:
              // body contains code and message on 401 error
              throw new UnauthorizedError(body.message);
            case 403:
              // body contains code and message on 403 error
              throw new ForbiddenError(body.message);
            case 404:
              // body contains code and message on 404 error
              throw new NotFoundError(response.statusText, body);
            default:
              throw new Error(response.statusText);
          }
        }
        return body;
      });
    });
};

/**
 * fetch util for Upload requests (with formData)
 *
 * @template T the response type of this request
 * @param method 'POST'|'PUT'|....
 * @param route without apiEndpoint starting from '/'
 * @param formData a formData with all the data to be send to API
 */
export const fetchUpload = <T>(method: 'POST', route: string, formData: FormData): Promise<T> => {
  return fetch(`${process.env.REACT_APP_API_URL}${route}`, {
    method,
    headers: {
      accept: 'application/json',
    },
    credentials: 'include',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
};

export const fetchRefresh = (): Promise<boolean> => {
  return fetch(`${process.env.REACT_APP_API_URL}/refresh-token`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual',
  }).then((response) => response.ok);
};
