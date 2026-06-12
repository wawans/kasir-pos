import { useState, useDeferredValue, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  children,
}: DataTableToolbarProps<TData>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globalFilterValue, setGlobalFilterValue] = useState<any>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table.getState().globalFilter as any
  )
  const deferredGlobalFilterValue = useDeferredValue(globalFilterValue)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchKeyValue, setSearchKeyValue] = useState<any>(
    searchKey ? (table.getColumn(searchKey)?.getFilterValue() ?? '') : ''
  )
  const deferredSearchKeyValue = useDeferredValue(searchKeyValue)

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  useEffect(() => {
    table.setGlobalFilter(deferredGlobalFilterValue)
  }, [deferredGlobalFilterValue, table])

  useEffect(() => {
    if (searchKey)
      table.getColumn(searchKey)?.setFilterValue(deferredSearchKeyValue)
  }, [deferredSearchKeyValue, searchKey, table])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={(searchKeyValue ?? '') as string}
            onChange={(event) => setSearchKeyValue(event.target.value)}
            className='h-8 w-37.5 lg:w-62.5'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={(globalFilterValue ?? '') as string}
            onChange={(event) => setGlobalFilterValue(event.target.value)}
            className='h-8 w-37.5 lg:w-62.5'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
          {children}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
              setGlobalFilterValue('')
              setSearchKeyValue('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
