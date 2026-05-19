import React, { useCallback, useState } from 'react'
import { type AxiosRequestConfig } from 'axios'
import { API_URL } from '@/config/app.ts'
import { type Model } from '@/models'
import axios from '@/lib/axios.ts'
import useDialogState from '@/hooks/use-dialog-state'

export type Identifier = string | number

type DataDialogType = 'create' | 'update' | 'delete' | 'detail'
interface DataContextType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity extends Model = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataDialogContextType extends DataDialogType = any,
> {
  entity: string
  url: string
  open: DataDialogContextType | boolean
  setOpen: (str: DataDialogContextType | boolean) => void
  currentRow: Entity | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Entity | null>>
}

const DataContext = React.createContext<DataContextType | null>(null)

export type DataProviderProps = Pick<DataContextType, 'entity' | 'url'> & {
  children: React.ReactNode
}

export function DataProvider({ entity, url, children }: DataProviderProps) {
  const [open, setOpen] = useDialogState<DataContextType['open']>(null)
  const [currentRow, setCurrentRow] = useState<
    DataContextType['currentRow'] | null
  >(null)

  return (
    <DataContext
      value={{
        entity,
        url,
        open: open as DataContextType['open'],
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </DataContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataProvider = () => {
  const context = React.useContext(DataContext)

  if (!context) {
    throw new Error('useDataProvider has to be used within <DataProvider>')
  }

  const getAll = useCallback(
    async (
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      return await axios
        .get(`${API_URL}/${context.url}`, { ...config, params })
        .then((r) => r.data)
    },
    [context.url]
  )

  const getOne = useCallback(
    async (
      id: Identifier,
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      return await axios
        .get(`${API_URL}/${context.url}/${id}`, { ...config, params })
        .then((r) => r.data)
    },
    [context.url]
  )

  const create = useCallback(
    async (
      data: AxiosRequestConfig['params'],
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      return await axios
        .post(`${API_URL}/${context.url}`, data, { ...config, params })
        .then((r) => r.data)
    },
    [context.url]
  )

  const update = useCallback(
    async (
      id: Identifier,
      data: AxiosRequestConfig['params'],
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      return await axios
        .put(`${API_URL}/${context.url}/${id}`, data, { ...config, params })
        .then((r) => r.data)
    },
    [context.url]
  )

  const updateMany = useCallback(
    async (
      ids: Identifier[],
      data: AxiosRequestConfig['params'],
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      const responses = await Promise.all(
        ids.map((id) =>
          axios
            .put(`${API_URL}/${context.url}/${id}`, data, { ...config, params })
            .then((r) => r.data)
        )
      )
      return { data: responses }
    },
    [context.url]
  )

  const destroy = useCallback(
    async (
      id: Identifier,
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      return await axios
        .delete(`${API_URL}/${context.url}/${id}`, { ...config, params })
        .then((r) => r.data)
    },
    [context.url]
  )

  const destroyMany = useCallback(
    async (
      ids: Identifier[],
      params: AxiosRequestConfig['params'] = {},
      config: Omit<AxiosRequestConfig, 'params'> = {}
    ) => {
      const responses = await Promise.all(
        ids.map((id) =>
          axios
            .delete(`${API_URL}/${context.url}/${id}`, { ...config, params })
            .then((r) => r.data)
        )
      )
      return { data: responses }
    },
    [context.url]
  )

  return {
    ...context,
    getAll,
    getOne,
    create,
    update,
    updateMany,
    destroy,
    destroyMany,
  }
}
