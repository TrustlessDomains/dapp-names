import { getConnection } from '@/connection';
import { SupportedChainId } from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { generateNonceMessage, verifyNonceMessage } from '@/services/auth';
import { getCurrentProfile } from '@/services/profile';
import { useAppDispatch } from '@/state/hooks';
import {
  resetUser,
  updateEVMWallet,
  updateSelectedWallet,
  updateTaprootWallet,
  updateWalletInfo,
} from '@/state/user/reducer';
import { getUserSelector } from '@/state/user/selector';
import { switchChain } from '@/utils';
import {
  clearAccessTokenStorage,
  getAccessToken,
  setAccessToken,
} from '@/utils/auth-storage';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as TC_SDK from 'trustless-computer-sdk';
import useAsyncEffect from 'use-async-effect';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { getBnsDefault } from '@/services/bns-explorer';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  requestBtcAddress: () => Promise<void>;
  onConnect: () => Promise<string | null>;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>((r) => r()),
  requestBtcAddress: () => new Promise<void>((r) => r()),
  onConnect: () => new Promise<null>((r) => r(null)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const { connector, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);
  const router = useRouter();

  const disconnect = React.useCallback(async () => {
    console.log('disconnecting...');
    console.log('user', user);
    if (user?.walletAddress) {
      bitcoinStorage.removeUserTaprootAddress(user?.walletAddress);
    }
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    clearAccessTokenStorage();
    dispatch(resetUser());
  }, [connector, dispatch, user]);

  const connect = React.useCallback(async () => {
    const connection = getConnection(connector);
    if (!connection) {
      throw new Error('Get connection error.');
    }
    await connection.connector.activate();
    if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
      await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
    }
    const addresses = await connector.provider?.request({
      method: 'eth_accounts',
    });
    if (addresses && Array.isArray(addresses)) {
      const evmWalletAddress = addresses[0];
      const data = await generateNonceMessage({
        address: evmWalletAddress,
      });
      if (data) {
        const web3Provider = new Web3(window.ethereum as provider);
        const signature = await web3Provider.eth.personal.sign(
          Web3.utils.fromUtf8(data),
          evmWalletAddress,
          '',
        );
        const { token: accessToken, refreshToken } = await verifyNonceMessage({
          address: evmWalletAddress,
          signature: signature,
        });
        console.log('signature', signature);
        setAccessToken(accessToken, refreshToken);
        dispatch(updateEVMWallet(evmWalletAddress));
        dispatch(updateSelectedWallet({ wallet: connection.type }));
        return evmWalletAddress;
      }
    }
    return null;
  }, [connector, chainId, dispatch]);

  const requestBtcAddress = useCallback(async (): Promise<void> => {
    await TC_SDK.actionRequest({
      method: TC_SDK.RequestMethod.account,
      redirectURL: window.location.href,
      target: '_self',
      isMainnet: true,
    });
  }, []);

  useEffect(() => {
    if (user?.walletAddress && !user.walletAddressBtcTaproot) {
      const taprootAddress = bitcoinStorage.getUserTaprootAddress(
        user?.walletAddress,
      );
      if (!taprootAddress) return;
      dispatch(updateTaprootWallet(taprootAddress));
    }
  }, [user, dispatch]);

  useAsyncEffect(async () => {
    const accessToken = getAccessToken();
    if (accessToken && connector) {
      try {
        const connection = getConnection(connector);
        if (!connection) {
          throw new Error('Get connection error.');
        }

        try {
          await connection.connector.activate();
        } catch (err) {
          console.log(err);
        }

        if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
          await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
        }
        const { walletAddress } = await getCurrentProfile();
        const { name, pfpData = {} } = await getBnsDefault(walletAddress);
        dispatch(updateWalletInfo({ name, avatar: pfpData?.gcsUrl }));
        dispatch(updateEVMWallet(walletAddress));
        dispatch(updateSelectedWallet({ wallet: 'METAMASK' }));
      } catch (err: unknown) {
        clearAccessTokenStorage();
        console.log(err);
      }
    }
  }, [dispatch, connector]);

  useEffect(() => {
    const handleAccountsChanged = async () => {
      console.log('accountsChanged');
      await disconnect();
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${ROUTE_PATH.HOME}`);
    };

    if (window.ethereum) {
      Object(window.ethereum).on('accountsChanged', handleAccountsChanged);
    }
  }, [disconnect, router]);

  useEffect(() => {
    const { tcAddress, tpAddress } = router.query as {
      tcAddress: string;
      tpAddress: string;
    };
    if (tpAddress) {
      dispatch(updateTaprootWallet(tpAddress));
      bitcoinStorage.setUserTaprootAddress(tcAddress, tpAddress);
      router.push(ROUTE_PATH.HOME);
    }
  }, [dispatch, router]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      onDisconnect: disconnect,
      onConnect: connect,
      requestBtcAddress,
    };
  }, [disconnect, connect, requestBtcAddress]);

  return (
    <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>
  );
};
