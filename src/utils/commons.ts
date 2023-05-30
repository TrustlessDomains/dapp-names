import { APP_ENV } from '@/configs';
import { AppEnv } from '@/enums/configs';

export const isProduction = (): boolean => {
  return APP_ENV === AppEnv.PRODUCTION;
};

export const isDevelop = (): boolean => {
  return APP_ENV === AppEnv.DEVELOP;
};
