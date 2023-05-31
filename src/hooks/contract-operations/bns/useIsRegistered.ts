import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import BNSABIJson from '@/abis/bns.json';
import { BNS_CONTRACT } from '@/configs';
import { useCallback } from 'react';
import { stringToBuffer } from '@trustless-computer/dapp-core';
import { TransactionEventType } from '@/enums/transaction';
import { getContract } from '@/utils';
import web3Provider from '@/connection/web3-provider';

export interface ICheckIfRegisteredNameParams {
  name: string;
  owner: string;
}

const useIsRegistered: ContractOperationHook<ICheckIfRegisteredNameParams, boolean> = () => {

  const call = useCallback(
    async (params: ICheckIfRegisteredNameParams): Promise<boolean> => {
      const { name, owner } = params;
      const contract = getContract(BNS_CONTRACT, BNSABIJson.abi, web3Provider.web3);
      const byteCode = stringToBuffer(name);
      const res = await contract.registered(byteCode, {
        from: owner
      });
      return res;
    },
    [],
  );

  return {
    call,
    dAppType: DAppType.BNS,
    transactionType: TransactionEventType.NONE,
  };
};

export default useIsRegistered;
