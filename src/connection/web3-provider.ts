import { CURRENT_TC_NETWORK } from '@/configs';
import { JsonRpcProvider } from 'ethers';

class Web3Provider {
  web3: JsonRpcProvider;

  constructor(rpcEndpoint: string) {
    this.web3 = new JsonRpcProvider(rpcEndpoint);
  }

  async getBalance(tcAdrress: string): Promise<string> {
    const balance = await this.web3.getBalance(tcAdrress);
    return balance.toString();
  }
}

const web3Provider = new Web3Provider(CURRENT_TC_NETWORK.TCNode);

export default web3Provider;
