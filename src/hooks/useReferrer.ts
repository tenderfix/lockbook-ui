import { useCookie } from './useCookie';

const getDomain = () => {
  const hostParts = window.location.host.split('.');

  hostParts.shift();

  return `.${hostParts.join('.')}`;
};

export const useReferrer = (): [string, string] => {
  const params = new URLSearchParams(window.location.search);

  const isApp = params.get('mobile_app') === 'true';
  const urlReferrer = params.get('referrer');
  const landingUrlFromCookie = useCookie('_landingUrl');
  const landingUrl =
    landingUrlFromCookie !== undefined && landingUrlFromCookie !== ''
      ? landingUrlFromCookie
      : window.location.pathname + window.location.search;
  const cookieReferrer = useCookie('_landingReferrer');
  const domain = getDomain();

  const referrerToSet = isApp
    ? 'docu_app'
    : urlReferrer !== null && urlReferrer !== ''
    ? urlReferrer
    : document.referrer !== ''
    ? document.referrer
    : 'blank';

  if (cookieReferrer === undefined || cookieReferrer === '') {
    document.cookie = `_landingUrl=${landingUrl};domain=${domain};path=/`;
    document.cookie = `_landingReferrer=${referrerToSet};domain=${domain};path=/`;
  }

  return [referrerToSet, landingUrl];
};
