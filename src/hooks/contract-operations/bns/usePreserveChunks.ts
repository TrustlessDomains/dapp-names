import ArtifactABIJson from '@/abis/artifacts.json';
import { ARTIFACT_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import { AssetsContext } from '@/contexts/assets-context';
import { useContract } from '@/hooks/useContract';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
import { TransactionEventType } from '@/enums/transaction';

export interface IPreserveChunkParams {
  address: string;
  chunks: Array<Buffer> | string;
  txSuccessCallback?: (_tx: Transaction | null) => Promise<void>;
}

const usePreserveChunks: ContractOperationHook<
  IPreserveChunkParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const contract = useContract(ARTIFACT_CONTRACT, ArtifactABIJson.abi, true);
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const estimateGas = useCallback(
    async (params: IPreserveChunkParams): Promise<string> => {
      if (account && provider && contract) {
        const { address, chunks } = params;
        const gasLimit = await contract.estimateGas.preserveChunks(address, chunks);
        const gasLimitBN = new BigNumber(gasLimit.toString());
        const gasBuffer = gasLimitBN.times(1.1).decimalPlaces(0);
        logger.debug('usePreserveChunks estimate gas', gasBuffer.toString());
        return gasBuffer.toString();
      }
      return '1000000000';
    },
    [contract, provider, account],
  );

  const call = useCallback(
    async (params: IPreserveChunkParams): Promise<Transaction | null> => {
      if (account && provider && contract) {
        logger.debug('usePreserveChunks', params);

        const { address, chunks, txSuccessCallback } = params;
        const firstChunk = chunks.length > 0 ? chunks[0] : null;
        let tcTxSizeByte = TRANSFER_TX_SIZE;

        if (firstChunk) {
          // const { compressedSize } = await compressFileAndGetSize({
          //   fileBase64: firstChunk.toString('base64'),
          // });
          tcTxSizeByte = TRANSFER_TX_SIZE + chunks.length;
        }

        logger.info(`tcTxSizeByte: ${tcTxSizeByte}`);

        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: tcTxSizeByte,
          feeRatePerByte: feeRate.hourFee,
        });

        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(
            `Insufficient BTC balance. Please top up at least ${formatBTCPrice(
              estimatedFee.totalFee.toString(),
            )} BTC.`,
          );
        }

        const gasLimit = await estimateGas(params);
        logger.debug('gasLimit', gasLimit);
        const transaction = await contract
          .connect(provider.getSigner())
          .preserveChunks(address, chunks, {
            gasLimit: gasLimit,
          });

        if (txSuccessCallback) {
          await txSuccessCallback(transaction);
        }

        return transaction;
      }

      return null;
    },
    [account, provider, contract, btcBalance, feeRate, estimateGas],
  );

  return {
    call: call,
    estimateGas: estimateGas,
    dAppType: DAppType.BFS,
    transactionType: TransactionEventType.MAP,
  };
};

export default usePreserveChunks;
