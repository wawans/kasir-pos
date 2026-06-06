import type { AxiosRequestConfig } from 'axios'
import { getDataQueryOptions } from '@/components/data/utils'

export const PaymentMethodsQueryOptions = (
  search?: string,
  params: AxiosRequestConfig['params'] = {}
) =>
  getDataQueryOptions(
    'Payment Method',
    'payment-method',
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
