import type { ColumnDef, Table as TTable } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui/table'

type DataTableSkeletonProps<TData> = {
  columns?: ColumnDef<any>[]
  table?: TTable<TData>
  className?: string
  tdClassName?: string
  thClassName?: string
  tdRowClassName?: string
  thRowClassName?: string
  wrapperClassName?: string
}

const cols: ColumnDef<any>[] = [
  {
    id: 'id',
    header: () => (
      <div className='flex h-8 items-center'>
        <Skeleton className='h-4 flex-1' />
      </div>
    ),
    cell: () => (
      <div className='flex'>
        <Skeleton className='h-4 flex-1' />
      </div>
    ),
  },
]
export function DataTableSkeleton<TData>({
  className,
  tdClassName,
  thClassName,
  tdRowClassName,
  thRowClassName,
  wrapperClassName,
  ...props
}: DataTableSkeletonProps<TData>) {
  if (!props.columns && !props.table) {
    throw new Error('required columns or table')
  }

  const columns = props.columns ? props.columns : cols

  // eslint-disable-next-line react-hooks/incompatible-library
  const local = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const table = props.table ? props.table : local

  return (
    <div className={cn('overflow-hidden rounded-md border', wrapperClassName)}>
      <Table className={cn(className)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={cn(thRowClassName)}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      thClassName,
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    <Skeleton className='h-6 flex-1' />
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {Array.from({
            length: table.getState().pagination.pageSize || 10,
          }).map((_, index) => (
            <TableRow key={index} className={cn(tdRowClassName)}>
              {(table.getVisibleFlatColumns() || table.getAllColumns()).map(
                (column, index) => (
                  <TableCell
                    key={index}
                    className={cn(
                      tdClassName,
                      column?.columnDef?.meta?.className,
                      column?.columnDef?.meta?.tdClassName
                    )}
                  >
                    <Skeleton className='h-4 flex-1' />
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
