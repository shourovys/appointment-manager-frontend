import { env } from './env';

export const config = {
  api: {
    baseURL: 'https://appointment-manager-backend.netlify.app/api',
    timeout: env.VITE_API_TIMEOUT,
  },
  features: {
    analytics: env.VITE_ENABLE_ANALYTICS,
    sentry: env.VITE_ENABLE_SENTRY,
  },
  environment: env.VITE_APP_ENV,
  isDevelopment: env.VITE_APP_ENV === 'development',
  isProduction: env.VITE_APP_ENV === 'production',
} as const;

export { env };
