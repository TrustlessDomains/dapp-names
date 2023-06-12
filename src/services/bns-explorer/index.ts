import { IPagingParams } from '@/interfaces/api/query';
import { IBNS } from '@/interfaces/bns';
import { apiClient } from '..';
import { camelCaseKeys } from '@trustless-computer/dapp-core';

const API_PATH = '/bns-service/names';

export const getCollectionsBns = async ({
  limit = 12,
  page = 1,
}): Promise<IBNS[]> => {
  const res = await apiClient.get(`${API_PATH}?limit=${limit}&page=${page}`);
  return Object(camelCaseKeys(res));
};

export const getBnsByWallet = async ({
  limit = 12,
  page = 1,
  walletAddress = '',
}: {
  walletAddress: string;
} & IPagingParams): Promise<IBNS[]> => {
  const res = await apiClient(
    `${API_PATH}/owned/${walletAddress}?limit=${limit}&page=${page}`,
  );
  return Object(camelCaseKeys(res));
};
