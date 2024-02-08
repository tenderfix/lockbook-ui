interface Window {
  dataLayer?: unknown[];
}

export const initDataLayer = (userId?: number, companyId?: number): void => {
  const windowWithDataLayer = window as Window;

  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push({
    event: 'data_layer_loaded',
    userId: userId,
    companyId: companyId,
    dataLayerLoaded: true,
  });
};

export const pushUserData = (userId: number, companyId: number): void => {
  const windowWithDataLayer = window as Window;

  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push({
    event: 'user_logged_in',
    userId: userId,
    companyId: companyId,
  });
};
