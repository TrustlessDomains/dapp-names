import BNSABIJson from '@/abis/bns.json';
import { BNS_CONTRACT } from '@/configs';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { useContract } from '@/hooks/useContract';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { stringToBuffer } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IRegisterNameParams {
  name: string;
  selectFee: number;
}

const useRegister: ContractOperationHook<
  IRegisterNameParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const contract = useContract(BNS_CONTRACT, BNSABIJson.abi, true);
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IRegisterNameParams): Promise<Transaction | null> => {
      if (account && provider && contract) {
        const { name, selectFee } = params;
        const byteCode = stringToBuffer(name);
        console.log({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });
        const estimatedFee = TC_SDK.estimateInscribeFee({
          // TODO remove hardcode
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });
        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
        }
        const transaction = await contract
          .connect(provider.getSigner())
          .register(account, byteCode);

        return transaction;
      }

      return null;
    },
    [account, provider, contract, btcBalance, feeRate],
  );

  return {
    call,
    dAppType: DAppType.BNS,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useRegister;
