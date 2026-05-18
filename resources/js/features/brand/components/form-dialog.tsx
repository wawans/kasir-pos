'use client'

import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useDataProvider } from '@/components/data/data-provider'


const formSchema = z
  .object({
    name: z.string().min(1, 'name is required.'),
  })


type DataForm = z.infer<typeof formSchema>

type FormDialogProps = {
  currentRow?: App.Data.BrandData
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function FormDialog({
                             currentRow,
                             open,
                             onOpenChange,
                           }: FormDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
    ? {
      ...currentRow
      } : {
        name: '',
      }
  })

  const { entity, create, update } = useDataProvider()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: UserForm) =>
      isEdit ? update(currentRow.id, values) : create(values),
    onSuccess: () => {
      form.reset()
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
        if (response?.data?.errors) {
          for (const [key, value] of Object.entries(response.data.errors)) {
            form.setError(key as keyof z.infer<typeof formSchema>, {
              type: 'server',
              message: value[0] || 'Invalid',
            })
          }

          // if (Object.hasOwn(response.data.errors, 'error')) showErrorAlert()
        }

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

  const onSubmit = (values: DataForm) => {
    form.clearErrors()
    mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit ' + entity : 'Add New ' + entity}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update the ${entity} here. `
              : `Create new ${entity} here. `}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id={`${entity}-form`}
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem >
                    <FormLabel >
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            className='min-w-[7rem]'
            disabled={isPending}
            type='submit'
            form={`${entity}-form`}
          >
            {isPending ? <Spinner /> : <Save />}
            <span>{isEdit ? 'Update' : 'Save'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}
