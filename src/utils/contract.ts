import { JsonRpcProvider, Contract, ZeroAddress, isAddress } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getContract(address: string, ABI: any, provider: JsonRpcProvider): Contract {
  if (!isAddress(address) || address === ZeroAddress) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider);
}
