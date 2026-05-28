'use client'

import { useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { cn } from '@/lib/utils.ts'
import { useQueryApi } from '@/hooks/use-query-api.ts'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group.tsx'
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
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { useDataProvider } from '@/components/data/data-provider'
import { DatePicker } from '@/components/date-picker.tsx'
import { SelectCombobox } from '@/components/select-combobox.tsx'

const formSchema = z.object({
  supplier_id: z.coerce.number().min(1, 'supplier is required.'),
  payment_method_id: z.coerce.number().min(1, 'payment method is required.'),
  reference: z.string().min(1, 'reference is required.'),
  note: z.string().optional(),
  status: z.coerce.number(),
  payment_status: z.coerce.number().min(1, 'name is required.'),
  payment_date: z
    .date('Date is required.')
    .max(new Date(), 'Date cannot be in the future')
    .optional(),
  payment_amount: z.coerce
    .number()
    .gt(0, 'payment_amount must be greater than or equal to zero.'),
  tax: z.coerce.number().gt(0, 'tax must be greater than or equal to zero.'),
  discount: z.coerce
    .number()
    .gt(0, 'discount must be greater than or equal to zero.'),
  shipping: z.coerce
    .number()
    .gt(0, 'shipping must be greater than or equal to zero.'),
  price: z.coerce
    .number()
    .gt(0, 'price must be greater than or equal to zero.'),
  total: z.coerce
    .number()
    .gt(0, 'total must be greater than or equal to zero.'),
  date: z
    .date('Date is required.')
    .max(new Date(), 'Date cannot be in the future'),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().min(1, 'Product is required'),
        unit_id: z.coerce.number().min(1, 'Unit is required'),
        quantity: z.coerce.number().min(1, 'Quantity is required'),
        discount: z.coerce
          .number()
          .gte(0, 'Discount must be greater than or equal to zero'),
        price: z.coerce
          .number()
          .gte(0, 'Price must be greater than or equal to zero'),
        subtotal: z.coerce
          .number()
          .gte(0, 'Subtotal must be greater than or equal to zero'),
        product_name: z.string().optional().nullish(),
        unit_name: z.string().optional().nullish(),
      })
    )
    .min(1, 'Add at least one item'),
})

type DataForm = z.infer<typeof formSchema>

type FormDialogProps = {
  currentRow?: App.Data.PurchaseData
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
      date: new Date(),
      items: [],
    },
  })

  const {
    fields,
    append,
    remove,
    update: edit,
  } = useFieldArray({
    name: 'items',
    control: form.control,
  })

  const [productId, setProductId] = useState<string>(null)
  const [searchProduct, setSearchProduct] = useState<string>('')
  const { data: products, isLoading: isProductsLoading } = useQueryApi(
    'Product',
    'product',
    searchProduct,
    { include: 'unit,stock.unit' }
  )

  const addItem = (productId) => {
    const items = form.getValues('items')
    const exist = items.find((f) => f.product_id == productId)
    const product = (products || []).find(
      (f) => f.id == productId
    ) as App.Data.ProductData
    if (product && !exist) {
      append({
        product_id: product.id,
        product_name: product.name,
        unit_id: product.unit_id,
        unit_name: product.unit?.alias,
        quantity: 1,
        discount: 0,
        price: product.product_price,
        subtotal: product.product_price,
      })
    }
    if (product && exist) {
      // edit()
    }
    // reset
    setProductId(null)
  }

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
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Purchase Date</FormLabel>
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='h-fit items-start'>
                <FormLabel>Product</FormLabel>
                <ButtonGroup className='w-full'>
                  <ButtonGroup>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => addItem(productId)}
                    >
                      <PlusIcon />
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className='col-span-full w-full'>
                    <SelectCombobox
                      data={products}
                      search={searchProduct}
                      onSearchChange={setSearchProduct}
                      value={productId}
                      onValueChange={(v) => setProductId(v)}
                      isLoading={isProductsLoading}
                      valueBy='id'
                      labelBy='name'
                      className='col-span-full w-full'
                      manualFiltering={true}
                    />
                  </ButtonGroup>
                </ButtonGroup>
                <FormMessage />
              </FormItem>

              <div className={cn('overflow-hidden rounded-md border')}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className='text-end'>Price</TableHead>
                      <TableHead className='text-end'>Quantity</TableHead>
                      <TableHead className='text-end'>Discount</TableHead>
                      <TableHead className='text-end'>Sub Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className='h-fit items-start'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.product_name`}
                            name={`items.${index}.product_name`}
                            render={({ field: subfield }) => (
                              <FormItem>
                                <FormLabel>{subfield.value}</FormLabel>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.unit_name`}
                            name={`items.${index}.unit_name`}
                            render={({ field: subfield }) => (
                              <FormItem>
                                <FormLabel>{subfield.value}</FormLabel>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start text-end'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.price`}
                            name={`items.${index}.price`}
                            render={({ field: subfield }) => (
                              <FormItem className='text-end'>
                                <FormLabel className='text-end'>
                                  {subfield.value}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start text-end'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.quantity`}
                            name={`items.${index}.quantity`}
                            render={({ field: subfield }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type='number'
                                    className='max-w-24 text-end'
                                    {...subfield}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start text-end'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.discount`}
                            name={`items.${index}.discount`}
                            render={({ field: subfield }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type='number'
                                    className='max-w-36 text-end'
                                    {...subfield}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start text-end'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.subtotal`}
                            name={`items.${index}.subtotal`}
                            render={({ field: subfield }) => (
                              <FormItem className='text-end'>
                                <FormLabel className='text-end'>
                                  {subfield.value}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className='h-fit items-start text-end'>
                          <Button
                            className='text-red-500!'
                            variant='outline'
                            size='icon'
                            onClick={() => remove(index)}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
