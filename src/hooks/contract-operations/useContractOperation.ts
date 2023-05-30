import { ROUTE_PATH } from '@/constants/route-path';
import { ContractOperationHook } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { capitalizeFirstLetter } from '@/utils/string';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(
  args: IParams<P, R>,
): IContractOperationReturn<P, R> => {
  const {
    operation,
  } = args;
  const { call } = operation();
  const user = useSelector(getUserSelector);
  const router = useRouter();

  const run = async (params: P): Promise<R> => {
    try {
      // This function does not handle error
      // It delegates error to caller

      if (!user?.tcAddress) {
        router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
        throw Error('Please connect wallet to continue.');
      }

      const tx: R = await call({
        ...params,
      });

      logger.debug(tx);

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
