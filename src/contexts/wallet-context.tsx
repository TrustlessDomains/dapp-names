import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/state/hooks';
import {
  resetUser,
  updateBtcAddress,
  updateTcAddress,
  updateWalletAccounts,
} from '@/state/user/reducer';
import { clearAuthStorage, getAuthStorage, setAuthStorage } from '@/utils/auth-storage';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import walletConnector from '@/connectors/tc-connector';
import logger from '@/services/logger';
import { User } from '@/interfaces/user';

export interface IWalletContext {
  disconnect: () => Promise<void>;
  connect: () => Promise<User | null>;
}

const initialValue: IWalletContext = {
  disconnect: () => new Promise<void>((r) => r()),
  connect: () => new Promise<null>((r) => r(null)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const disconnect = React.useCallback(async () => {
    clearAuthStorage();
    dispatch(resetUser());
    router.push(ROUTE_PATH.CONNECT_WALLET);
  }, [dispatch, router]);

  const connect = React.useCallback(async (): Promise<User | null> => {
    try {
      const { tcAddress, btcAddress, accounts } = await walletConnector.requestAccount({
        target: "_blank",
      });

      logger.info(`tcAddress: ${tcAddress}`);
      logger.info(`btcAddress: ${btcAddress}`);
      logger.info(`accounts: ${JSON.stringify(accounts)}`);

      dispatch(updateTcAddress(tcAddress))
      dispatch(updateBtcAddress(btcAddress));
      dispatch(updateWalletAccounts(accounts));
      setAuthStorage({
        tcAddress,
        btcAddress,
        accounts,
      })

      return { tcAddress, btcAddress, accounts };
    } catch (err: unknown) {
      logger.debug(err);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    const cacheUser = getAuthStorage();
    if (!cacheUser) return;

    const { tcAddress, btcAddress, accounts } = cacheUser;
    dispatch(updateTcAddress(tcAddress))
    dispatch(updateBtcAddress(btcAddress));
    dispatch(updateWalletAccounts(accounts));
  }, [dispatch]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      connect,
      disconnect,
    };
  }, [disconnect, connect]);

  return (
    <WalletContext.Provider value={contextValues}>
      {children}
    </WalletContext.Provider>
  );
};
