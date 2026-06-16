import type { AxiosRequestConfig } from 'axios'
import { getDataQueryOptions } from '@/components/data/utils'

export const ProductsCategoriesQueryOptions = (
  search?: string,
  params: AxiosRequestConfig['params'] = {}
) =>
  getDataQueryOptions(
    'Category',
    'category',
    {
      perPage: 100,
      sort: 'name',
      ...(search ? { filter: { name: search } } : {}),
      ...params,
    },
    {
      gcTime: 1000 * 60 * 5,
    }
  )
