'use client'

import { useState } from 'react'
import { type AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDataProvider } from '@/components/data/data-provider'

const CONFIRM_WORD = 'DELETE'

type DeleteBulkDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}
export function DeleteBulkDialog<TData>({
  open,
  onOpenChange,
  table,
}: DeleteBulkDialogProps<TData>) {
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const { entity, destroyMany } = useDataProvider()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: typeof selectedRows) =>
      destroyMany(values.map((f) => (f.original as { id: number }).id)),
    onSuccess: () => {
      setValue('')
      table.resetRowSelection()

      onOpenChange(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [entity],
        refetchType: 'all',
      })
    },
    onError: ({ response }: AxiosError<LaravelValidationError>) => {
      if (response?.status === 422) {
        if (response?.data?.message) {
          toast.error('Error!', {
            description: response?.data?.message || 'Something went wrong.',
          })
        }
      } else {
        toast.error('Error!', { description: 'Something went wrong' })
      }
    },
  })

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    mutate(selectedRows)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form={`${entity}-multi-delete-form`}
      disabled={value.trim() !== CONFIRM_WORD}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length} {entity}
        </span>
      }
      desc={
        <form
          id={`${entity}-multi-delete-form`}
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete the selected {entity}? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={isPending ? <Spinner /> : 'Delete'}
      destructive
    />
  )
}
