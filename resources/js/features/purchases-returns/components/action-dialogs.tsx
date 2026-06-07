import { useDataProvider } from '@/components/data/data-provider'
import { DeleteDialog } from '@/components/data/delete-dialog'
import { FormDialog } from './form-dialog'

export function ActionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDataProvider()
  return (
    <>
      {currentRow && (
        <>
          <DeleteDialog
            key={`data-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
