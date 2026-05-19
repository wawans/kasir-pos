import { useDataTableProvider } from '@/components/data/data-table-provider'
import { DeleteBulkAction } from './delete-bulk-action'

export function TableBulkActions() {
  const table = useDataTableProvider()

  return (
    <>
      <DeleteBulkAction table={table} />
    </>
  )
}
