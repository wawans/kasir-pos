import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { UserTimestampCell } from '@/components/data-table/shared/user-timestamp-cell'
import { NumberInput } from '@/components/form/number-input'
import { TableRowActions } from './table-row-actions'

export const columns: ColumnDef<App.Data.StockData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ getValue }) => (
      <div className='w-fit ps-2 text-nowrap'>{getValue() as string}</div>
    ),
  },
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit ps-2 text-nowrap'>{original?.product?.name}</div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Stock Qty'
        className='justify-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original?.quantity || 0}
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.unit?.alias}</span>
      </div>
    ),
  },
  {
    accessorKey: 'stock_alert_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Alert Qty'
        className='justify-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original?.stock_alert_quantity || 0}
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.unit?.alias}</span>
      </div>
    ),
  },
  {
    accessorKey: 'stock_limit_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Limit Qty'
        className='justify-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original?.stock_limit_quantity || 0}
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.unit?.alias}</span>
      </div>
    ),
  },
  {
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row: { original } }) => (
      <div className='flex w-fit gap-1.5 text-nowrap'>
        {original?.is_alert && (
          <Badge variant='warning'>
            <AlertTriangle /> low
          </Badge>
        )}
        {original?.is_limit && (
          <Badge variant='danger'>
            <AlertTriangle /> limited
          </Badge>
        )}
        {!original?.is_alert && !original?.is_limit && (
          <Badge variant={original?.quantity > 0 ? 'success' : 'destructive'}>
            {original?.quantity > 0 ? 'available' : 'not available'}
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
