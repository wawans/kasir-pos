import { createContext, useContext } from 'react'
import type { Table, RowData } from '@tanstack/react-table'

export const createDataTableContext = <TData extends RowData>() =>
  createContext<Table<TData> | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTableContext = createDataTableContext<any>()

export const useDataTableProvider = () => {
  const context = useContext(DataTableContext)
  if (!context)
    throw new Error(
      'useDataTableProvider must be used within DataTableProvider'
    )
  return context
}
