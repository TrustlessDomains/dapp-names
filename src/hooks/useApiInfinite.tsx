import { useEffect, useMemo, useState } from 'react';

import { BareFetcher, SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

import { unstable_serialize } from 'swr/infinite';

import { reorderKeys } from '@/utils/swr';

const PAGE_SIZE = 36;

export type ApiInfiteHook<T> = {
  initialData?: Array<T>;
  data?: Array<T>;
  isFirstLoading: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  isReachingEnd: boolean;
  isRefreshing: boolean;
  // loading: boolean;
  page: number;
  loadMore: () => void;
  refresh: () => void;
  clear: () => void;
  error?:
    | string
    | {
        message: string;
        status: number;
        data: unknown;
        error_code: number;
      };
};

export type IPagination = {
  limit: number;
  page: number;
};

export type ApiResponse<T> = {
  kind: 'ok';
  data: T;
  ok: true;
  message?: string;
};

const defaultPagination = {
  page: 1,
  limit: PAGE_SIZE,
};

export const getApiInfiniteKey = (
  fetcher: BareFetcher,
  params?: Record<string, unknown>,
): string => {
  return unstable_serialize((currentPage) => {
    return [
      fetcher.name,
      reorderKeys({
        ...defaultPagination,
        page: currentPage + 1,
        ...params,
      }),
    ];
  });
};

export function useApiInfinite<Data extends { pagination: IPagination }>(
  fetcher: BareFetcher<ApiResponse<Data>>,
  params?: Record<string, unknown>,
  config?: SWRConfiguration,
): ApiInfiteHook<Data> {
  const res = useSWRInfinite<Data>(
    (currentPage, previousPageData) => {
      if (previousPageData) {
        const { pagination } = previousPageData;
        if (pagination.last_id) {
          if (pagination.total_current_item < pagination.limit) {
            return null;
          }
        } else if (pagination.total_page <= pagination.page) {
          return null;
        }
      }

      const filter = reorderKeys({
        limit: PAGE_SIZE,
        page: currentPage + 1,
        last_id: previousPageData?.pagination.last_id,
        ...params,
      });

      return [fetcher.name, filter];
    },
    async (_, filter) => {
      const response: ApiResponse<Data> = await fetcher(filter);
      if (response?.kind === 'ok') {
        return response.data;
      } else if (response?.kind === 'bad-data') {
        throw response.data;
      } else {
        throw new Error(response?.kind);
      }
    },
    {
      revalidateFirstPage: false,
      ...config,
    },
  );
  const { data, error, mutate, size, setSize, isValidating } = res;
  const [internalData, setInternalData] = useState<Array<Data> | undefined>(data);
  const isFirstLoading = !internalData && !error;
  const isEmpty = internalData?.[0]?.pagination?.total_item === 0;
  const isReachingEnd = useMemo(() => {
    if (isEmpty) {
      return true;
    }
    if (internalData) {
      const lastData = internalData[internalData.length - 1];
      if (lastData?.pagination?.last_id) {
        return (
          lastData?.pagination?.total_current_item < lastData?.pagination?.limit
        );
      }
      return lastData?.pagination?.page === lastData?.pagination?.total_page;
    }
    return false;
  }, [isEmpty, internalData]);
  const isRefreshing =
    isValidating && !!internalData && internalData.length === size;
  const isLoadingMore =
    isFirstLoading ||
    (size > 0 &&
      !isReachingEnd &&
      !!internalData &&
      typeof internalData[size - 1] === 'undefined');

  useEffect(() => {
    if (data) {
      setInternalData(data);
    }
  }, [data]);

  return {
    initialData: data,
    data: internalData,
    isFirstLoading,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    page: size,
    loadMore: () => {
      if (!isLoadingMore) {
        setSize((prevSize) => prevSize + 1);
      }
    },
    refresh: () => mutate(),
    clear: () => setSize(0),
  };
}

export default useApiInfinite;
