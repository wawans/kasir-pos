import type { AxiosRequestConfig } from 'axios'
import { getDataQueryOptions } from '@/components/data/utils'
import { Entity, EntityURL } from '../index'

export const AdjustmentsCategoriesQueryOptions = (
  search?: string,
  params: AxiosRequestConfig['params'] = {}
) =>
  getDataQueryOptions(
    Entity,
    EntityURL,
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
