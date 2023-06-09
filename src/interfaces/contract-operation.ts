import { TransactionEventType } from '@/enums/transaction';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export enum DAppType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifactx
  BNS = 'Name', // Name
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  dAppType: DAppType;
  transactionType: TransactionEventType;
  estimateGas?: (args: P) => Promise<string>;
};

export type DeployContractResponse = {
  hash: string;
  contractAddress: string;
  deployTransaction: TransactionResponse;
};
