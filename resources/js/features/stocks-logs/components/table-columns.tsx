import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { UserTimestampCell } from '@/components/data-table/shared/user-timestamp-cell'
import { NumberInput } from '@/components/form/number-input'

export const columns: ColumnDef<App.Data.StockData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
    cell: ({ getValue }) => (
      <div className='w-fit ps-2 text-nowrap'>{getValue() as string}</div>
    ),
    meta: {
      thClassName: 'max-w-7',
    },
  },
  {
    id: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>{original?.type}</div>
    ),
  },
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>{original?.product?.name}</div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Change Qty'
        className='justify-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original?.quantity || 0}
          allowNegative
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.unit?.alias}</span>
      </div>
    ),
    meta: {
      thClassName: 'max-w-10',
    },
  },
  {
    accessorKey: 'remaining_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Remaining Qty'
        className='justify-end'
      />
    ),
    cell: ({ getValue, row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={(getValue() as number) || 0}
          allowNegative
          thousandSeparator
          asText
        />
        <span className='ps-1'>{original?.unit?.alias}</span>
      </div>
    ),
    meta: {
      thClassName: 'max-w-10',
    },
  },
  {
    id: 'by',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='By' />
    ),
    cell: UserTimestampCell,
  },
]
