import { useDataProvider } from '@/components/data/data-provider'
import { DeleteDialog } from '@/components/data/delete-dialog'
import { FormDialog } from './form-dialog'

export function ActionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDataProvider()
  return (
    <>
      <FormDialog
        key='data-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <FormDialog
            key={`data-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

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
