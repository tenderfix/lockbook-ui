class LegalApi {
  async hasAcceptedLatestLegalDocuments(): Promise<boolean> {
    const request = new Request(process.env.REACT_APP_API_URL + '/has-accepted-latest-legal', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    const response = await fetch(request);

    if (response.status === 409) {
      return false;
    }

    return true;
  }

  async acceptLatestLegalDocuments(): Promise<Response> {
    const request = new Request(process.env.REACT_APP_API_URL + '/accept-latest-legal', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });

    return fetch(request);
  }
}

export const legalApi = new LegalApi();
