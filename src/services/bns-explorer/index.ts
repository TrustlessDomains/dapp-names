import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { IBNS, IOwnedBNS } from '@/interfaces/bns';
import { swrFetcher } from '@/utils/swr';
import { apiClient } from '@/services';
import { camelCaseKeys } from '@trustless-computer/dapp-core';

const API_PATH = '/bns-service';

export const getCollectionsBns = ({ limit = 12, page = 1 }): Promise<IBNS[]> =>
  swrFetcher(`${API_URL}${API_PATH}/names?limit=${limit}&page=${page}`, {
    method: 'GET',
  });

export const getBnsByWallet = ({
  limit = 12,
  page = 1,
  walletAddress = '',
}: {
  walletAddress: string;
} & IPagingParams): Promise<IOwnedBNS[]> =>
  swrFetcher(
    `${API_URL}${API_PATH}/names/owned/${walletAddress}?limit=${limit}&page=${page}`,
    {
      method: 'GET',
    },
  );

export const getBnsDefault = (walletAddress: string): Promise<IOwnedBNS> =>
  swrFetcher(`${API_URL}${API_PATH}/default/${walletAddress}`, {
    method: 'GET',
  });

export const getListResolversByWalletAddress = ({
  limit,
  page,
  walletAddress,
}: {
  limit: number;
  page: number;
  walletAddress: string;
}): Promise<IOwnedBNS[]> =>
  swrFetcher(
    `${API_URL}${API_PATH}/names?resolver=${walletAddress}&limit=${limit}&page=${page}`,
    {
      method: 'GET',
    },
  );

export const updateBnsDefault = async (
  walletAddress: string,
  tokenId: string,
): Promise<IOwnedBNS> => {
  try {
    const res = await apiClient.put(`${API_PATH}/default/${walletAddress}`, {
      token_id: tokenId,
    });
    return Object(camelCaseKeys(res));
  } catch (err: unknown) {
    throw Error('Fail to update bns default');
  }
};
