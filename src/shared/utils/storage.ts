const AUTH_TOKEN_KEY = 'authToken';
const THEME_MODE_KEY = 'theme';

export const STORAGE = {
  getAuthToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setAuthToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  removeAuthToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),

  getThemeMode: () => localStorage.getItem(THEME_MODE_KEY) || 'light',
  changeThemeMode: (mode: 'light' | 'dark') =>
    localStorage.setItem(THEME_MODE_KEY, mode),
};
