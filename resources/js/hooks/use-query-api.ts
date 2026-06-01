import type { AxiosRequestConfig } from 'axios'
import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'

export const useQueryApi = (
  entity: string,
  url: string,
  search?: string,
  params: AxiosRequestConfig['params'] = {}
) =>
  useQuery({
    queryKey: [entity, { url, search, params }],
    queryFn: () =>
      axios
        .get(`/api/${url}`, {
          params: {
            perPage: 100,
            ...(search ? { filter: { name: search } } : {}),
            ...params,
          },
        })
        .then((r) => r.data?.data || []),
    gcTime: 1000 * 60 * 5,
  })
