import { IBTCNetwork } from 'tc-connect';

export enum AppEnv {
  PRODUCTION = 'production',
  DEVELOP = 'develop',
}

type BTCNetworkNumbType = {
  [key in IBTCNetwork]: number;
};

export const BTCNetworkNumber: BTCNetworkNumbType = {
  mainnet: 1,
  testnet: 2,
  regtest: 3,
};
