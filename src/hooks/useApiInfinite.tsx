/* eslint-disable @typescript-eslint/no-explicit-any */
import { BareFetcher, KeyedMutator, SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { PAGE_SIZE } from '@/constants/config';

export type ApiInfiniteHook<T> = {
  dataInfinite?: Array<T>;
  data?: T;
  isLoadingMore: boolean;
  isEmpty: boolean;
  isReachingEnd: boolean;
  isRefreshing: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<T>;
  page: number;
  loadMore: () => void;
  refresh: () => void;
  clear: () => void;
};

type Data = any;

export const useApiInfinite = (
  fetcher: BareFetcher,
  params?: Record<string, unknown>,
  config?: SWRConfiguration,
): ApiInfiniteHook<Data> => {
  const limit = params?.limit || PAGE_SIZE;
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<Data>(
      (currentPage) => {
        return {
          ...params,
          limit,
          page: currentPage + 1, // Incremented index
        };
      },
      async (reParams) => {
        const result = await fetcher(reParams);
        return result;
      },
      {
        revalidateFirstPage: false, //  To validate first page before the call of every next page
        ...config,
      },
    );
  const dataInfinite = data ? [].concat(...data) : [];
  const isEmpty = data?.[0]?.length === 0;
  const isLoadingMore =
    isLoading ||
    (size > 0 && data && typeof data[size - 1] === 'undefined') ||
    false;
  const isRefreshing = (isValidating && data && data.length === size) || false;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < limit) || false;

  return {
    dataInfinite,
    data,
    mutate,
    page: size,
    loadMore: () => {
      if (!isLoadingMore) {
        setSize((prevSize) => prevSize + 1);
      }
    },
    isValidating,
    isLoadingMore,
    isEmpty,
    isRefreshing,
    isReachingEnd,
    refresh: () => mutate(),
    clear: () => setSize(0),
  };
};

export default useApiInfinite;
