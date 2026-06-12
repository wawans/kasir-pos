import type { AxiosRequestConfig } from 'axios'
import { getDataQueryOptions } from '@/components/data/utils'

export const ProductsQueryOptions = (
  search?: string,
  params: AxiosRequestConfig['params'] = {}
) =>
  getDataQueryOptions(
    'Product',
    'product',
    {
      perPage: 100,
      include: 'unit,stock.unit',
      sort: 'name',
      ...(search ? { filter: { name: search } } : {}),
      ...params,
    },
    {
      gcTime: 1000 * 60 * 5,
    }
  )
