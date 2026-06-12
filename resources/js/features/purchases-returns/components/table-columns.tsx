import * as React from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { UserTimestampCell } from '@/components/data-table/shared/user-timestamp-cell'
import { DateText } from '@/components/date-text'
import { NumberInput } from '@/components/form/number-input'
import { LongText } from '@/components/long-text'
import { TableRowActions } from './table-row-actions'

export const columns: ColumnDef<App.Data.PurchaseReturnData>[] = [
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
  {
    id: 'purchase',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Purchase No./Ref.' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>
        <div>
          <span>{original.purchase?.reference}</span>
        </div>
        <div>
          <DateText
            value={original.purchase?.date}
            asDate
            className='text-xs text-muted-foreground'
          />
        </div>
      </div>
    ),
  },
  {
    id: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Return No./Ref.' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-nowrap'>
        <div>
          <span>{original.reference}</span>
        </div>
        <div>
          <DateText
            value={original.date}
            asDate
            className='text-xs text-muted-foreground'
          />
        </div>
      </div>
    ),
  },
  {
    id: 'supplier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Supplier' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-ellipsis'>{original.supplier?.name}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit ps-2 text-nowrap'>
        <Badge variant={original.status === '1' ? 'success' : 'outline'}>
          {original.status_type?.label}
        </Badge>
      </div>
    ),
  },
  // {
  //   id: 'item',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Item' />
  //   ),
  //   cell: ({ row: { original } }) => (
  //     <div className='w-fit '>{0}</div>
  //   ),
  // },
  {
    id: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Total'
        className='pe-2 text-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original.total || 0}
          thousandSeparator
          asText
        />
      </div>
    ),
  },
  {
    id: 'paid',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Paid'
        className='pe-2 text-end'
      />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={original.payment_amount || 0}
          thousandSeparator
          asText
        />
      </div>
    ),
  },
  {
    id: 'pay_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Status' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit'>{original.payment_status_type?.label}</div>
    ),
  },
  {
    id: 'pay_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Method' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit'>{original.payment_method?.name}</div>
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
