import Web3 from 'web3';
import { ceilPrecised } from '@trustless-computer/dapp-core';

export const formatEthPrice = (price: string | number | null, emptyStr?: string, precision = 4): string => {
  if (!price) return emptyStr || '-';
  return ceilPrecised(parseFloat(Web3.utils.fromWei(`${price}`, 'ether')), precision)
    .toString()
    .replace(',', '.');
};
