import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import BNSABIJson from '@/abis/bns.json';
import { BNS_CONTRACT } from '@/configs';
import { useCallback } from 'react';
import { stringToBuffer } from '@trustless-computer/dapp-core';
import { TransactionEventType } from '@/enums/transaction';
import { ethers } from "ethers";
import { IRequestSignResp } from 'tc-connect';
import connector from '@/connectors/tc-connector';
import logger from '@/services/logger';
import web3Provider from '@/connection/web3-provider';
import { getContract } from '@/utils';

export interface ITransferNameParams {
  to: string;
  name: string;
  from: string;
}

const useTransferName: ContractOperationHook<ITransferNameParams, IRequestSignResp | null> = () => {
  const call = useCallback(
    async (params: ITransferNameParams): Promise<IRequestSignResp | null> => {
      const { from, to, name } = params;
      const contract = getContract(BNS_CONTRACT, BNSABIJson.abi, web3Provider.web3);
      const byteCode = stringToBuffer(name);
      const tokenId = await await contract.registry(byteCode, {
        from: from
      });

      const ContractInterface = new ethers.Interface(BNSABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("transferFrom", [
        from,
        to,
        tokenId
      ]);

      const response = await connector.requestSign({
        from: from,
        target: "_blank",
        calldata: encodeAbi,
        to: BNS_CONTRACT,
        value: "",
        redirectURL: window.location.href,
        isInscribe: true,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Transfer From',
        functionName: 'transferFrom(address,address,uint256)',
      });

      logger.debug(response);
      return response;
    },
    [],
  );

  return {
    call,
    dAppType: DAppType.BNS,
    transactionType: TransactionEventType.TRANSFER,
  };
};

export default useTransferName;
