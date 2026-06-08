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

export const columns: ColumnDef<App.Data.AdjustmentData>[] = [
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
    id: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No./Ref.' />
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
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Note' />
    ),
    cell: ({ row }) => (
      <LongText className='ps-2'>{row.getValue('note')}</LongText>
    ),
    meta: {
      className: 'max-w-2/6',
    },
  },
  {
    id: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit text-ellipsis'>{original.category?.name}</div>
    ),
  },
  {
    accessorKey: 'adjustment_total_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Item Amount'
        className='justify-end'
      />
    ),
    cell: ({ getValue }) => (
      <div className='w-auto pe-2 text-end text-nowrap'>
        <NumberInput
          className=''
          value={(getValue() as never) || 0}
          thousandSeparator
          asText
        />
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
