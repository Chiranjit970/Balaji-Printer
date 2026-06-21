const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export const config = {
  // Future API base URL (mock for now)
  apiBaseUrl: isDev
    ? 'http://localhost:8000/api'
    : 'https://api.balajiprinters.com/api',

  // Session config
  tokenKey: 'balaji_auth_token',

  // Splash duration (milliseconds)
  splashMinDuration: 1500,

  // App info
  appName: 'Balaji Printers',
  appVersion: '1.0.0',
} as const;
