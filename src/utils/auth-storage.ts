import { USER_PUBLIC_INFO } from '@/constants/storage-key';
import { User } from '@/interfaces/user';
import logger from '@/services/logger';
import { isBrowser } from '@trustless-computer/dapp-core';

export const getAuthStorage = (): User | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const json = localStorage.getItem(USER_PUBLIC_INFO) as string;
    return json ? JSON.parse(json) : null;
  } catch (err: unknown) {
    logger.error(err);
    return null;
  }
};

export const setAuthStorage = (payload: User): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(USER_PUBLIC_INFO, JSON.stringify(payload));
  } catch (err: unknown) {
    logger.error(err);
  }
};

export const clearAuthStorage = (): void => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(USER_PUBLIC_INFO);
};
