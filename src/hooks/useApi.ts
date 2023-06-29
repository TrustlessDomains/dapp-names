/* eslint-disable @typescript-eslint/no-explicit-any */
import { BareFetcher, SWRConfiguration } from 'swr';
import useSWR from 'swr/infinite';

import { reorderKeys } from '@/utils/swr';

export type ApiHook<T> = {
  data: T;
  isEmpty: boolean;
  isLoading: boolean;
  isValidating: boolean;
  error: string;
};

type Data = any;

export const useApi = (
  fetcher: BareFetcher,
  params?: Record<string, unknown>,
  config?: SWRConfiguration & { shouldFetch?: boolean },
): ApiHook<Data> => {
  const shouldFetch =
    typeof config?.shouldFetch === 'undefined' ? true : config?.shouldFetch; // Conditional fetching default is true
  const { data, error, isValidating, isLoading } = useSWR<Data>(
    () =>
      shouldFetch
        ? [fetcher.name, typeof params === 'string' ? params : reorderKeys(params)]
        : null,
    async () => {
      const result = await fetcher(params);
      return result;
    },
    config,
  );
  const isEmpty = data?.[0]?.length === 0;

  return {
    data,
    isLoading,
    isValidating,
    isEmpty,
    error,
  };
};

export default useApi;
