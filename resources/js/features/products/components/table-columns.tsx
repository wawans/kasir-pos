import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { UserTimestampCell } from '@/components/data-table/shared/user-timestamp-cell'
import { NumberInput } from '@/components/form/number-input'
import { TableRowActions } from './table-row-actions'

export const columns: ColumnDef<App.Data.ProductData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
  //   cell: ({ getValue }) => (
  //     <div className='w-fit ps-2 text-nowrap'>{getValue() as string}</div>
  //   ),
  // },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('name')}</div>
    ),
  },
  {
    id: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code / Ref.' />
    ),
    cell: ({ row: { original } }) => (
      <div className='flex w-fit flex-col gap-1'>
        {original?.code && <Badge variant='neutral'>{original?.code}</Badge>}
        {original?.reference && (
          <Badge variant='outline'>{original?.reference}</Badge>
        )}
      </div>
    ),
  },
  {
    id: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>{original?.brand?.name}</div>
    ),
  },
  {
    id: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>{original?.category?.name}</div>
    ),
  },
  {
    accessorKey: 'product_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={row.getValue('product_price') || 0}
          thousandSeparator
          asText
        />
      </div>
    ),
  },
  {
    id: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original?.stock?.quantity || 0}
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.stock?.unit?.alias}</span>
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ getValue, row: { original } }) => (
      <div className='flex w-fit gap-1.5 ps-2 text-nowrap'>
        <Badge variant={getValue() ? 'success' : 'danger'}>
          {getValue() ? 'active' : 'inactive'}
        </Badge>
        {original?.stock?.is_alert && (
          <Badge variant='warning'>
            <AlertTriangle /> low
          </Badge>
        )}
        {original?.stock?.is_limit && (
          <Badge variant='danger'>
            <AlertTriangle /> limited
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'by',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='By' />
    ),
    cell: UserTimestampCell,
  },
  {
    id: 'actions',
    cell: TableRowActions,
  },
]
