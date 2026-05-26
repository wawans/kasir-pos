import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'

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
      <DataTableColumnHeader column={column} title='Change Qty' />
    ),
    cell: ({ row: { original } }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {original?.quantity} {original?.unit?.alias}
      </div>
    ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {format(row.getValue('updated_at'), 'dd/MM/yyyy HH:mm:ss')}
      </div>
    ),
  },
]
