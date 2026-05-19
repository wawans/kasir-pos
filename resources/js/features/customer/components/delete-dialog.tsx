'use client'

import { type AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  type Identifier,
  useDataProvider,
} from '@/components/data/data-provider'

type Row = {
  id: Identifier
}

type DeleteDialogProps<TData extends Row = Row> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: TData
}

export function DeleteDialog<TData extends Row>({
  open,
  onOpenChange,
  currentRow,
}: DeleteDialogProps<TData>) {
  const { entity, destroy } = useDataProvider()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (value: Identifier) => destroy(value),
    onSuccess: () => {
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
    mutate(currentRow.id as Identifier)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 mb-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete this {entity}: {currentRow?.id} ?
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete a {entity} with the ID{' '}
            <span className='font-bold'>{currentRow?.id}</span>?
            <br />
            This action will permanently remove the {entity} with the associated
            data from the system. This action cannot be undone.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? <Spinner /> : 'Delete'}
      destructive
    />
  )
}
