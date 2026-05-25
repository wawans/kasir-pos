'use client'

import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Loader, Save } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox.tsx'
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
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea.tsx'
import { useDataProvider } from '@/components/data/data-provider'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import axios from '@/lib/axios'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

const formSchema = z.object({
  name: z.string().min(1, 'name is required.'),
  code: z.string().max(30, 'max 30 characters length').optional(),
  reference: z.string().max(30, 'max 30 characters length').optional(),
  category_id: z.int().min(1, 'required'),
  brand_id: z.int().min(1, 'required'),
  unit_id: z.int().min(1, 'required'),
  product_cost: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  product_price: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  stock_alert_quantity: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  stock_limit_quantity: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  stock_opening_quantity: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  note: z.string().max(250, 'max 250 characters length').optional(),
  is_active: z.boolean().default(true).optional(),
})

type DataForm = z.infer<typeof formSchema>

type InputFieldNames = Partial<keyof Omit<DataForm, 'is_active'>>
type InputField = {
  name: InputFieldNames
  label?: string
  description?: string
  className?: string
}

type FormDialogProps = {
  currentRow?: App.Data.ProductData
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
    mode: 'onChange',
    defaultValues: {
      ...(isEdit ? currentRow : {}),
      name: isEdit ? currentRow.name || '' : '',
      code: isEdit ? currentRow.code || '' : '',
      reference: isEdit ? currentRow.reference || '' : '',
      category_id: isEdit ? currentRow.category_id || null : null,
      brand_id: isEdit ? currentRow.brand_id || null : null,
      unit_id: isEdit ? currentRow.unit_id || null : null,
      product_cost: isEdit ? currentRow.product_cost || 0 : 0,
      product_price: isEdit ? currentRow.product_price || 0 : 0,
      stock_alert_quantity: isEdit ? currentRow.stock_alert_quantity || 0 : 0,
      stock_limit_quantity: isEdit ? currentRow.stock_limit_quantity || 0 : 0,
      stock_opening_quantity: isEdit ? currentRow.stock_opening_quantity || 0 : 0,
      note: isEdit ? currentRow?.note || '' : '',
      is_active: isEdit ? currentRow?.is_active : true,
    },
  })

  const [catsValue, setCatsValue] = useState<string>('')
  const {data: cats, isLoading: isCatsLoading} = useQuery({
    queryKey: ['Category', { catsValue }],
    queryFn: () => axios.get('/api/category', { params: {
      perPage: 100,
      filter: { name: catsValue }
      }}).then((r) => r.data),
    gcTime: 1000*60*5
  })

  const { entity, create, update } = useDataProvider()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) =>
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

  const fields1: InputField[] = [
    { name: 'code', label: 'SKU/Code', },
    { name: 'reference', label: 'No./Ref.', },
  ]

  const fields2: InputField[] = [
    { name: 'product_cost', label: 'Buying Cost', },
    { name: 'product_price', label: 'Selling Price', },
  ]

  const fields3: InputField[] = [
    { name: 'stock_opening_quantity', label: 'Stock Opening Qty', description:'Add this quantity to stocks'},
    { name: 'stock_alert_quantity', label: 'Stock Alert Qty', description:'Show alert when stocks is below this quantity'},
    { name: 'stock_limit_quantity', label: 'Stock Limit Qty', description:'No Sale when stocks is below this quantity'},
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-4xl'>
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
        <div className='min-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id={`${entity}-form`}
              onSubmit={form.handleSubmit(onSubmit)}
              className='px-0.5 grid sm:grid-cols-2 gap-x-4 gap-y-2.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='sm:col-span-full'>
                    <FormLabel>Name<span className='text-destructive'>*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields1.map(({ name, label, description }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                       <FormDescription>{description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-auto justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? (cats?.data || []).find(
                                (f) => f.id === field.value
                              )?.name
                              : 'Select...'}
                            <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Command shouldFilter={false}>
                          <CommandInput value={catsValue} onValueChange={setCatsValue} placeholder='Search...' />
                          {!isCatsLoading && <CommandEmpty>No data found.</CommandEmpty>}
                          <CommandGroup>
                            <CommandList>
                              {isCatsLoading && <CommandLoading >
                                <div className='flex items-center justify-center gap-2'>
                                <Spinner />
                                <span>Loading...</span>
                                </div>
                              </CommandLoading>}
                              { (cats?.data || []).map((f) => (
                                <CommandItem
                                  value={f.name}
                                  key={f.id}
                                  onSelect={() => {
                                    form.setValue('category_id', f.id)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'size-4',
                                      f.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {f.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields2.map(({ name, label, description }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className='items-start h-fit'>
                      <FormLabel>{label}<span className='text-destructive'>*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                       <FormDescription>{description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              {fields3.map(({ name, label, description }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                       <FormDescription>{description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem className='sm:col-span-full'>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem className='relative flex flex-row items-center'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Set as Active</FormLabel>
                    </div>
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
