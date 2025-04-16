import { env } from '@/config/env';

export const getConfirmAccountUrl = (token: string, email: string, language?: string) => {
  const baseUrl = env.app.CLIENT_URL;
  return `${baseUrl}/${language}/confirm-account?token=${token}&email=${email}`;
};

export const getDashboardUrl = (language?: string) => {
  const baseUrl = env.app.CLIENT_URL;
  return `${baseUrl}/${language}/dashboard`;
};

export const getResetPasswordUrl = (token: string, expiresAt: number) => {
  const baseUrl = env.app.CLIENT_URL;
  return `${baseUrl}/reset-password?token=${token}&exp=${expiresAt}`;
};
