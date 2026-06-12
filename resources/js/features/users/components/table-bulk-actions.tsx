import { useDataTableProvider } from '@/components/data/data-table-provider'
import { DeleteBulkAction } from '@/components/data/delete-bulk-action'

export function TableBulkActions() {
  const table = useDataTableProvider()

  return (
    <>
      <DeleteBulkAction table={table} />
    </>
  )
}
