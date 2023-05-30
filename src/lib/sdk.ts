import * as TC_SDK from 'trustless-computer-sdk';
import { CURRENT_TC_NETWORK } from '@/configs';
import { BTCNetworkNumber } from '@/enums/configs';

const setupSDK = () => {
  TC_SDK.setBTCNetwork(BTCNetworkNumber.mainnet);

  // setup storage
  const storage = new TC_SDK.StorageService();
  storage.implement({
    namespace: undefined,
    async getMethod(key: string): Promise<string | null> {
      return localStorage.getItem(key);
    },
    async removeMethod(key: string): Promise<void> {
      localStorage.removeItem(key);
    },
    async setMethod(key: string, data: string): Promise<void> {
      return localStorage.setItem(key, data);
    },
  });

  const tcClient = new TC_SDK.TcClient(CURRENT_TC_NETWORK.BTCNetwork, CURRENT_TC_NETWORK.TCNode);

  TC_SDK.setupConfig({
    storage,
    tcClient,
    netType: BTCNetworkNumber.mainnet,
  });
};

export { setupSDK };
