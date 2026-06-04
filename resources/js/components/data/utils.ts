import type { AxiosRequestConfig } from 'axios'
import {
  queryOptions,
  type QueryOptions,
  type QueryObserverOptions,
} from '@tanstack/react-query'
import { API_URL } from '@/config/app'
import axios from '@/lib/axios'
import type { Identifier } from './data-provider'

export const getAll = async (
  url: string,
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  return await axios
    .get(`${API_URL}/${url}`, { ...config, params })
    .then((r) => r.data)
}

export const getOne = async (
  url: string,
  id: Identifier,
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  return await axios
    .get(`${API_URL}/${url}/${id}`, { ...config, params })
    .then((r) => r.data)
}

export const create = async (
  url: string,
  data: AxiosRequestConfig['params'],
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  return await axios
    .post(`${API_URL}/${url}`, data, { ...config, params })
    .then((r) => r.data)
}

export const update = async (
  url: string,
  id: Identifier,
  data: AxiosRequestConfig['params'],
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  return await axios
    .put(`${API_URL}/${url}/${id}`, data, { ...config, params })
    .then((r) => r.data)
}

export const updateMany = async (
  url: string,
  ids: Identifier[],
  data: AxiosRequestConfig['params'],
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  const responses = await Promise.all(
    ids.map((id) =>
      axios
        .put(`${API_URL}/${url}/${id}`, data, { ...config, params })
        .then((r) => r.data)
    )
  )
  return { data: responses }
}

export const destroy = async (
  url: string,
  id: Identifier,
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  return await axios
    .delete(`${API_URL}/${url}/${id}`, { ...config, params })
    .then((r) => r.data)
}

export const destroyMany = async (
  url: string,
  ids: Identifier[],
  params: AxiosRequestConfig['params'] = {},
  config: Omit<AxiosRequestConfig, 'params'> = {}
) => {
  const responses = await Promise.all(
    ids.map((id) =>
      axios
        .delete(`${API_URL}/${url}/${id}`, { ...config, params })
        .then((r) => r.data)
    )
  )
  return { data: responses }
}

export type GetAllArgs = Parameters<typeof getAll>
export type GetOneArgs = Parameters<typeof getOne>
export type CreateArgs = Parameters<typeof create>
export type UpdateArgs = Parameters<typeof update>
export type UpdateManyArgs = Parameters<typeof updateMany>
export type DestroyArgs = Parameters<typeof destroy>
export type DestroyManyArgs = Parameters<typeof destroyMany>

type Options = QueryOptions &
  Pick<
    QueryObserverOptions,
    | 'enabled'
    | 'staleTime'
    | 'refetchInterval'
    | 'refetchIntervalInBackground'
    | 'refetchOnWindowFocus'
    | 'refetchOnReconnect'
    | 'refetchOnMount'
    | 'retryOnMount'
    | 'suspense'
  >
export const getAllQueryOptions = (
  entity: string,
  url: string,
  params: AxiosRequestConfig['params'] = {},
  options: Options = {}
) =>
  queryOptions({
    queryKey: [entity, { url, ...params }],
    queryFn: () => getAll(url, params),
    ...options,
  })

export const getDataQueryOptions = (
  entity: string,
  url: string,
  params: AxiosRequestConfig['params'] = {},
  options: Options = {}
) =>
  queryOptions({
    queryKey: [entity, { url, ...params }],
    queryFn: () => getAll(url, params).then((r) => r.data || []),
    ...options,
  })

export const getOneQueryOptions = (
  entity: string,
  url: string,
  id: GetOneArgs[1],
  params: AxiosRequestConfig['params'] = {},
  options: Options = {}
) =>
  queryOptions({
    queryKey: [entity, { url, id, ...params }],
    queryFn: () => getOne(url, id, params),
    ...options,
  })
