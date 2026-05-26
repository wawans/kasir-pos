'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import axios, { type LaravelValidationError } from '@/lib/axios'
import { cn } from '@/lib/utils'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea.tsx'
import { useDataProvider } from '@/components/data/data-provider'
import { SelectCombobox } from '@/components/select-combobox.tsx'

const formSchema = z.object({
  name: z.string().min(1, 'name is required.'),
  code: z.string().max(30, 'max 30 characters length').optional(),
  reference: z.string().max(30, 'max 30 characters length').optional(),
  category_id: z.coerce.number().min(1, 'required'),
  brand_id: z.coerce.number().min(1, 'required'),
  unit_id: z.coerce.number().min(1, 'required'),
  product_cost: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  product_price: z.coerce.number().gte(0, 'must be greater or equal to 0'),
  stock_alert_quantity: z.coerce
    .number()
    .gte(0, 'must be greater or equal to 0'),
  stock_limit_quantity: z.coerce
    .number()
    .gte(0, 'must be greater or equal to 0'),
  stock_opening_quantity: z.coerce
    .number()
    .gte(0, 'must be greater or equal to 0'),
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

const useApi = (entity: string, url: string, search: string) =>
  useQuery({
    queryKey: [entity, { url, search }],
    queryFn: () =>
      axios
        .get(`/api/${url}`, {
          params: {
            perPage: 100,
            filter: { name: search },
          },
        })
        .then((r) => r.data?.data || []),
    gcTime: 1000 * 60 * 5,
  })

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
      product_cost: 0,
      product_price: 0,
      stock_alert_quantity: 0,
      stock_limit_quantity: 0,
      stock_opening_quantity: 0,
      is_active: true,
    },
  })

  useEffect(() => {
    function loadValues() {
      form.reset({
        name: currentRow?.name,
        code: currentRow?.code || '',
        reference: currentRow?.reference || '',
        category_id: currentRow?.category_id,
        brand_id: currentRow?.brand_id,
        unit_id: currentRow?.unit_id,
        product_cost: currentRow?.product_cost,
        product_price: currentRow?.product_price,
        stock_alert_quantity: currentRow?.stock_alert_quantity,
        stock_limit_quantity: currentRow?.stock_limit_quantity,
        stock_opening_quantity: currentRow?.stock_opening_quantity,
        note: currentRow?.note || '',
        is_active: currentRow?.is_active,
      })
    }

    if (isEdit) loadValues()
  }, [currentRow, form, form.reset, isEdit])

  const [catsValue, setCatsValue] = useState<string>('')
  const { data: cats, isLoading: isCatsLoading } = useApi(
    'Category',
    'category',
    catsValue
  )
  const [searchUnit, setSearchUnit] = useState<string>('')
  const { data: units, isLoading: isUnitsLoading } = useApi(
    'Unit',
    'unit',
    searchUnit
  )
  const [searchBrand, setSearchBrand] = useState<string>('')
  const { data: brands, isLoading: isBrandsLoading } = useApi(
    'Brand',
    'brand',
    searchBrand
  )

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
    { name: 'code', label: 'SKU/Code' },
    { name: 'reference', label: 'No./Ref.' },
  ]

  const fields2: InputField[] = [
    { name: 'product_cost', label: 'Buying Cost' },
    { name: 'product_price', label: 'Selling Price' },
  ]

  const fields3: InputField[] = [
    {
      name: 'stock_opening_quantity',
      label: 'Stock Opening Qty',
      description: 'Add this quantity to stocks',
    },
    {
      name: 'stock_alert_quantity',
      label: 'Stock Alert Qty',
      description: 'Show alert when stocks is below this quantity',
    },
    {
      name: 'stock_limit_quantity',
      label: 'Stock Limit Qty',
      description: 'No Sale when stocks is below this quantity',
    },
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
              className='grid gap-x-4 gap-y-2.5 px-0.5 sm:grid-cols-2'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='h-fit items-start sm:col-span-full'>
                    <FormLabel>
                      Name<span className='text-destructive'>*</span>
                    </FormLabel>
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
                    <FormItem className='h-fit items-start'>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {description && (
                        <FormDescription>{description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name='brand_id'
                render={({ field }) => (
                  <FormItem className='h-fit items-start'>
                    <FormLabel>Brand</FormLabel>
                    <SelectCombobox
                      data={brands}
                      search={searchBrand}
                      onSearchChange={setSearchBrand}
                      value={field.value}
                      onValueChange={(v) => form.setValue('brand_id', v)}
                      isLoading={isBrandsLoading}
                      valueBy='id'
                      labelBy='name'
                      manualFiltering={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem className='h-fit items-start'>
                    <FormLabel>Category</FormLabel>
                    <SelectCombobox
                      data={cats}
                      search={catsValue}
                      onSearchChange={setCatsValue}
                      value={field.value}
                      onValueChange={(v) => form.setValue('category_id', v)}
                      valueBy='id'
                      labelBy='name'
                      isLoading={isCatsLoading}
                      manualFiltering={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='unit_id'
                render={({ field }) => (
                  <FormItem className='h-fit items-start'>
                    <FormLabel>Unit</FormLabel>
                    <SelectCombobox
                      data={units}
                      search={searchUnit}
                      onSearchChange={setSearchUnit}
                      value={field.value}
                      onValueChange={(v) => form.setValue('unit_id', v)}
                      isLoading={isUnitsLoading}
                      valueBy='id'
                      labelBy='name'
                      manualFiltering={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields2.map(({ name, label, description }, i) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        i == 0 && 'col-start-1',
                        'h-fit items-start'
                      )}
                    >
                      <FormLabel>
                        {label}
                        <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {description && (
                        <FormDescription>{description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              {fields3.map(({ name, label, description }, i) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        i == 0 && 'col-start-1',
                        'h-fit items-start'
                      )}
                    >
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {description && (
                        <FormDescription>{description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem className='h-fit items-start sm:col-span-full'>
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
                  <FormItem className='relative flex h-fit flex-row items-start'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='mt-px space-y-1 leading-none'>
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
