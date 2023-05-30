import React, { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { getCollectedUTXO } from '@/services/bitcoin';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import web3Provider from '@/connection/web3-provider';

export interface IAssetsContext {
  tcBalance: string;
  btcBalance: string;
}

const initialValue: IAssetsContext = {
  tcBalance: '0',
  btcBalance: '0',
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const userInfo = useSelector(getUserSelector);
  const [tcBalance, setTCBalance] = React.useState<string>('0');
  const [assets, setAssets] = React.useState<ICollectedUTXOResp | undefined>();

  const fetchTCBalance = useCallback(async () => {
    if (!userInfo.tcAddress) {
      setTCBalance('0');
      return;
    }

    try {
      const balance = await web3Provider.getBalance(userInfo.tcAddress);
      setTCBalance(balance);
    } catch (e) {
      setTCBalance('0');
    }
  }, [userInfo]);

  const fetchBtcBalance = useCallback(async (): Promise<ICollectedUTXOResp | undefined> => {
    if (!userInfo?.tcAddress || !userInfo.btcAddress) {
      setAssets(undefined);
      return undefined;
    }

    try {
      const res = await getCollectedUTXO(userInfo.btcAddress, userInfo.tcAddress);
      setAssets(res);
      return res;
    } catch (e) {
      setAssets(undefined);
      return undefined;
    }
  }, [userInfo]);


  const fetchUserAssets = useCallback(async () => {
    fetchTCBalance();
    fetchBtcBalance();
  }, [fetchTCBalance, fetchBtcBalance])

  const btcBalance = React.useMemo(() => {
    return assets ? assets?.availableBalance.toString() : '0';
  }, [assets]);

  useEffect(() => {
    if (!userInfo?.tcAddress || !userInfo?.btcAddress) return;

    fetchUserAssets();

    const interval = setInterval(() => {
      fetchUserAssets();
    }, 30000);

    return () => clearInterval(interval);
  }, [userInfo?.tcAddress, userInfo?.btcAddress, fetchUserAssets]);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      tcBalance,
      btcBalance,
    };
  }, [
    tcBalance,
    btcBalance
  ]);

  return (
    <AssetsContext.Provider value={contextValues}>
      {children}
    </AssetsContext.Provider>
  );
};