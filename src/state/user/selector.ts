import { UserState } from '@/state/user/reducer';
import { RootState } from '@/state';

export const getUserSelector = (state: RootState): UserState => state.user;

export const getIsAuthenticatedSelector = (state: RootState): boolean =>
  !!state.user.tcAddress && !!state.user.btcAddress;
