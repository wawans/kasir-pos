import React, { useCallback, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import {
  client,
  create,
  type CreateArgs,
  destroy,
  type DestroyArgs,
  destroyMany,
  type DestroyManyArgs,
  getAll,
  getAllQueryOptions,
  getOne,
  type GetOneArgs,
  getOneQueryOptions,
  update,
  type UpdateArgs,
  updateMany,
  type UpdateManyArgs,
} from './utils'

export type Identifier = string | number

type DataDialogType = 'create' | 'update' | 'delete' | 'detail'
interface DataContextType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entity = any,
  DataDialogContextType extends string = DataDialogType,
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

  return {
    ...context,
    client,
    getAll: useCallback(
      (params = {}, config = {}) => getAll(context.url, params, config),
      [context.url]
    ),
    getOne: useCallback(
      (id: GetOneArgs[1], params = {}, config = {}) =>
        getOne(context.url, id, params, config),
      [context.url]
    ),
    create: useCallback(
      (data: CreateArgs[1], params = {}, config = {}) =>
        create(context.url, data, params, config),
      [context.url]
    ),
    update: useCallback(
      (id: UpdateArgs[1], data: UpdateArgs[2], params = {}, config = {}) =>
        update(context.url, id, data, params, config),
      [context.url]
    ),
    updateMany: useCallback(
      (
        id: UpdateManyArgs[1],
        data: UpdateManyArgs[2],
        params = {},
        config = {}
      ) => updateMany(context.url, id, data, params, config),
      [context.url]
    ),
    destroy: useCallback(
      (id: DestroyArgs[1], params = {}, config = {}) =>
        destroy(context.url, id, params, config),
      [context.url]
    ),
    destroyMany: useCallback(
      (id: DestroyManyArgs[1], params = {}, config = {}) =>
        destroyMany(context.url, id, params, config),
      [context.url]
    ),
    getAllQueryOptions: (params = {}) =>
      getAllQueryOptions(context.entity, context.url, params),
    getOneQueryOptions: (id: GetOneArgs[1], params = {}) =>
      getOneQueryOptions(context.entity, context.url, id, params),
  }
}
