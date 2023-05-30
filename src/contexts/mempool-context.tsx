import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { IMempoolFeeRate } from '@/interfaces/mempool';
import { getFeeRate } from '@/services/bitcoin';
import logger from '@/services/logger';

export interface IMempoolContext {
  feeRate: IMempoolFeeRate;
}

const initialValue: IMempoolContext = {
  feeRate: {
    fastestFee: 25,
    halfHourFee: 20,
    hourFee: 15,
    economyFee: 10,
    minimumFee: 5,
  }
};

export const MempoolContext = React.createContext<IMempoolContext>(initialValue);

export const MempoolProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const [feeRate, setFeeRate] = React.useState<IMempoolFeeRate>(initialValue.feeRate);

  const fetchFeeRate = async () => {
    try {
      const res = await getFeeRate();
      setFeeRate(res);
    } catch (err: unknown) {
      setFeeRate(initialValue.feeRate);
      logger.error(err)
    }
  };

  useEffect(() => {
    fetchFeeRate();

    const interval = setInterval(() => {
      fetchFeeRate();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const contextValues = useMemo((): IMempoolContext => {
    return {
      feeRate,
    };
  }, [
    feeRate,
  ]);

  return (
    <MempoolContext.Provider value={contextValues}>
      {children}
    </MempoolContext.Provider>
  );
};