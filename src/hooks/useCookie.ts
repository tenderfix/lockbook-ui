export const useCookie = (name: string): string | undefined => {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) {
    const cookie = parts.pop()?.split(';').shift();
    return cookie;
  }
};
