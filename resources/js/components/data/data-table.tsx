import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  TableOptions,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Model } from '@/models'
import { cn } from '@/lib/utils.ts'
import type { NavigateFn } from '@/hooks/use-table-url-state.ts'
import {
  DataTablePagination,
  DataTableToolbar,
  DataTableTable,
  DataTableSkeleton,
  DataTableBulkActions,
} from '@/components/data-table'
import { useDataProvider } from '@/components/data/data-provider.tsx'
import { DataTableContext } from '@/components/data/data-table-provider.tsx'

export type filter = {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  filters?: filter[]
  toolbar?: React.ReactNode
  // search?: Record<string, unknown>
  // navigate?: NavigateFn
  enableRowSelection?: TableOptions<TData>['enableRowSelection']
  enableColumnFilters?: TableOptions<TData>['enableColumnFilters']
  bulkActions?: React.ReactElement | React.ReactNode
}

export function DataTable<TData>({
  columns,
  toolbar,
  bulkActions,
  enableRowSelection,
  enableColumnFilters = false,
}: DataTableProps<TData>) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  const [globalFilter, onGlobalFilterChange] = useState('')
  const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>(
    []
  )
  const [pagination, onPaginationChange] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { entity, getAll } = useDataProvider()
  const { data, isLoading } = useQuery({
    queryKey: [entity, { sorting, globalFilter, columnFilters, pagination }],
    queryFn: () =>
      getAll({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        ...(globalFilter ? { search: globalFilter } : {}),
        ...(columnFilters.length
          ? {
              filter: columnFilters.reduce((acc, filter) => {
                acc[filter.id] = filter.value
                return acc
              }, {}),
            }
          : {}),
        ...(sorting.length
          ? { sort: sorting.map((s) => (s.desc ? `-${s.id}` : s.id)).join(',') }
          : {}),
      }),
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data || [],
    rowCount: data?.total || 0,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection,
    enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
    // getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange,
    onColumnFiltersChange,
    onPaginationChange,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    manualGrouping: true,
    manualExpanding: true,
  })

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableContext value={table}>
        <DataTableToolbar table={table} searchPlaceholder='Search ...'>
          {toolbar}
        </DataTableToolbar>
        <DataTableTable table={table} isLoading={isLoading} />
        <DataTablePagination table={table} className='mt-auto' />
        <DataTableBulkActions
          table={table}
          entityName={entity}
          children={bulkActions}
        />
      </DataTableContext>
    </div>
  )
}
