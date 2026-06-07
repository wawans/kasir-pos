'use client'

import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { useDataProvider } from '@/components/data/data-provider'
import { type DataForm, formSchema, type ItemForm } from './schema'

type FormDialogProps = {
  currentRow?: App.Data.SaleReturnData
}
export function FormDialog({ currentRow }: FormDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: isEdit
      ? {
          ...currentRow,
          description: currentRow?.description || '',
        }
      : {
          name: '',
          description: '',
          is_default: false,
        },
  })

  const { entity, create, update } = useDataProvider()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) =>
      isEdit ? update(currentRow.id, values) : create(values),
    onSuccess: (data) => {
      navigate({ to: '/sales-returns/$id', params: { id: data.data.id } })
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
            form.setError(key as keyof DataForm, {
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
    <Card>
      <CardHeader className='text-start'>
        <CardTitle>{isEdit ? 'Edit ' + entity : 'Add New ' + entity}</CardTitle>
        <CardDescription>
          {isEdit
            ? `Update the ${entity} here. `
            : `Create new ${entity} here. `}
          Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_default'
              render={({ field }) => (
                <FormItem className='relative flex flex-row items-center'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Set as Default</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className='min-w-[7rem]'
          disabled={isPending}
          type='submit'
          form={`${entity}-form`}
        >
          {isPending ? <Spinner /> : <Save />}
          <span>{isEdit ? 'Update' : 'Save'}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
