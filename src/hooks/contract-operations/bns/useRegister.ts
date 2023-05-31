import BNSABIJson from '@/abis/bns.json';
import { BNS_CONTRACT } from '@/configs';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { stringToBuffer } from '@trustless-computer/dapp-core';
import { useCallback } from 'react';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';

export interface IRegisterNameParams {
  name: string;
  owner: string;
}

const useRegister: ContractOperationHook<
  IRegisterNameParams,
  IRequestSignResp | null
> = () => {

  const call = useCallback(
    async (params: IRegisterNameParams): Promise<IRequestSignResp | null> => {
      const { name, owner } = params;
      const byteCode = stringToBuffer(name);
      const ContractInterface = new ethers.Interface(BNSABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("register", [
        owner,
        byteCode
      ]);

      const response = await connector.requestSign({
        from: owner,
        target: "_blank",
        calldata: encodeAbi,
        to: BNS_CONTRACT,
        value: "",
        redirectURL: window.location.href,
        isInscribe: true,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Register',
        functionName: 'register(address,bytes)',
      });

      logger.debug(response);
      return response;
    },
    [],
  );

  return {
    call,
    dAppType: DAppType.BNS,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useRegister;
