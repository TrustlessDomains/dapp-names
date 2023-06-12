import { FeeRateName, ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { IMempoolFeeRate } from '@/interfaces/mempool';
import { camelCaseKeys } from '@/utils/helpers';
import * as TC_SDK from 'trustless-computer-sdk';
import logger from './logger';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string,
  tcAddress: string,
): Promise<ICollectedUTXOResp | undefined> => {
  try {
    const collected = await TC_SDK.getUTXOs({
      btcAddress,
      tcAddress,
    });
    return collected;
  } catch (err) {
    logger.error(err);
  }
};

export const getFeeRate = async (): Promise<IMempoolFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    const fee: IMempoolFeeRate = await res.json();
    if (fee[FeeRateName.fastestFee] <= 10) {
      return {
        fastestFee: 25,
        halfHourFee: 20,
        hourFee: 15,
        economyFee: 10,
        minimumFee: 5,
      };
    }
    return camelCaseKeys(fee);
  } catch (err: unknown) {
    logger.error(err);
    return {
      fastestFee: 25,
      halfHourFee: 20,
      hourFee: 15,
      economyFee: 10,
      minimumFee: 5,
    };
  }
};
