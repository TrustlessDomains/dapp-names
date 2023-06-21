import { ApiResponse, reorderKeys } from '@/utils/swr';
import { useEffect, useState } from 'react';
import useSWR, { BareFetcher } from 'swr';
// import { reorderKeys } from '@/utils/common';

export type ApiHook<T> = {
  data?: T;
  isFirstLoading: boolean;
  loading: boolean;
  reload: () => void;
  error?:
    | string
    | {
        message: string;
        status: number;
        data: unknown;
        error_code: number;
      };
};

// export function getApiKey(
//   fetcher: BareFetcher,
//   params?: string | Record<string, unknown>,
// ): string {
//   return unstable_serialize([
//     fetcher.name,
//     typeof params === 'string' ? params : reorderKeys(params),
//   ]);
// }

export function useApi<Data>(
  fetcher: BareFetcher<ApiResponse<Data>>,
  params?: string | Record<string, unknown>,
  config?: Record<string, unknown>,
): ApiHook<Data> {
  const { data, error, mutate } = useSWR(
    () => [
      fetcher.name,
      params?.constructor === Object ? reorderKeys(params) : params,
    ],
    async (_, filter: unknown) => {
      const response: ApiResponse<Data> = await fetcher(filter);
      return response;
      // if (response?.kind === 'ok') {
      //   return response.data;
      // } else if (response?.kind === 'bad-data') {
      //   throw response.data;
      // } else {
      //   throw new Error(response?.kind);
      // }
    },
    config,
  );
  const [internalData, setInternalData] = useState<Data>(data);
  const isFirstLoading = !internalData && !error;
  const loading = !data && !error;

  useEffect(() => {
    if (data) {
      setInternalData(data);
    }
  }, [data]);

  return { data: internalData, isFirstLoading, loading, error, reload: mutate };
}

export default useApi;
