import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';

export const getAccessToken = (): string | null => {
  const accessToken = localStorage.get(ACCESS_TOKEN) as string;
  return accessToken;
};

export const clearAccessTokenStorage = (): void => {
  localStorage.remove(ACCESS_TOKEN);
  localStorage.remove(REFRESH_TOKEN);
};

export const setAccessToken = (accessToken: string, refreshToken: string): void => {
  localStorage.set(ACCESS_TOKEN, accessToken);
  localStorage.set(REFRESH_TOKEN, refreshToken);
};
