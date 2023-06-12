import { SupportedChainId } from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { ContractOperationHook } from '@/interfaces/contract-operation';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { capitalizeFirstLetter, switchChain } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import * as TC_SDK from 'trustless-computer-sdk';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
  chainId?: SupportedChainId;
  afterTcTxCallback?: (tx: R) => Promise<void>;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(
  args: IParams<P, R>,
): IContractOperationReturn<P, R> => {
  const {
    operation,
    chainId = SupportedChainId.TRUSTLESS_COMPUTER,
    inscribeable = true,
    afterTcTxCallback,
  } = args;
  const { call, dAppType, operationName } = operation();
  const { chainId: walletChainId } = useWeb3React();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);
  const router = useRouter();

  const checkAndSwitchChainIfNecessary = async (): Promise<void> => {
    if (walletChainId !== chainId) {
      await switchChain(chainId);
    }
  };

  const run = async (params: P): Promise<R> => {
    try {
      // This function does not handle error
      // It delegates error to caller

      if (!isAuthenticated || !user?.walletAddress) {
        router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
        throw Error('Please connect wallet to continue.');
      }

      // Check & switch network if necessary
      await checkAndSwitchChainIfNecessary();

      if (!inscribeable) {
        // Make TC transaction
        const tx: R = await call({
          ...params,
        });

        return tx;
      }

      const tx: R = await call({
        ...params,
      });

      if (afterTcTxCallback) {
        await afterTcTxCallback(tx);
      }

      TC_SDK.signTransaction({
        method: `${operationName} ${dAppType}`,
        hash: Object(tx).hash,
        dappURL: window.location.href,
        isRedirect: true,
        target: '_self',
        isMainnet: true,
      });

      return tx;
    } catch (err) {
      if (Object(err).reason) {
        throw Error(capitalizeFirstLetter(Object(err).reason));
      }
      throw err;
    }
  };

  return {
    run,
  };
};

export default useContractOperation;
