'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PaymentStatuses } from '@/types'
import { faker } from '@faker-js/faker'
import {
  Dices,
  MinusIcon,
  PlusIcon,
  Save,
  SparkleIcon,
  SparklesIcon,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { useQueryApi } from '@/hooks/use-query-api'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDataProvider } from '@/components/data/data-provider'
import { DatePicker } from '@/components/date-picker'
import { NumberInput } from '@/components/form/number-input'
import { SelectCombobox } from '@/components/select-combobox'
import { SelectDropdown } from '@/components/select-dropdown'

const itemSchema = z.object({
  product_id: z.coerce
    .number('invalid')
    .min(1, 'Product is required')
    .default(0),
  unit_id: z.coerce.number('invalid').min(1, 'Unit is required').default(0),
  quantity: z.coerce
    .number('invalid')
    .min(1, 'Quantity is required')
    .default(0),
  discount: z.coerce
    .number('invalid')
    .gte(0, 'Discount must be greater than or equal to zero')
    .default(0),
  price: z.coerce
    .number('invalid')
    .gte(0, 'Price must be greater than or equal to zero')
    .default(0),
  subtotal: z.coerce
    .number('invalid')
    .gte(0, 'Subtotal must be greater than or equal to zero')
    .default(0),
  product_name: z.string().optional().nullish(),
  unit_name: z.string().optional().nullish(),
})

const formSchema = z.object({
  supplier_id: z.coerce.number('invalid').min(1, 'supplier is required.'),
  payment_method_id: z.coerce
    .number('invalid')
    .min(1, 'payment method is required.'),
  reference: z.string().min(1, 'reference is required.'),
  note: z.string().optional(),
  status: z.coerce.number('invalid'),
  payment_status: z.string().min(1, 'payment status is required.'),
  payment_date: z
    .date('Date is required.')
    // .max(new Date(), 'Date cannot be in the future')
    .nullish(),
  payment_amount: z.coerce
    .number('invalid')
    .gte(0, 'payment amount must be greater than or equal to zero.'),
  tax: z.coerce
    .number('invalid')
    .gte(0, 'tax must be greater than or equal to zero.')
    .default(0),
  discount: z.coerce
    .number('invalid')
    .gte(0, 'discount must be greater than or equal to zero.')
    .default(0),
  shipping: z.coerce
    .number('invalid')
    .gte(0, 'shipping must be greater than or equal to zero.')
    .default(0),
  price: z.coerce
    .number('invalid')
    .gte(0, 'price must be greater than or equal to zero.')
    .default(0),
  total: z.coerce
    .number('invalid')
    .gte(0, 'total must be greater than or equal to zero.')
    .default(0),
  date: z.date('Date is required.'),
  // .max(new Date(), 'Date cannot be in the future')
  items: z.array(itemSchema).min(1, 'Add at least one item'),
})

type ItemForm = z.infer<typeof itemSchema>
type DataForm = z.infer<typeof formSchema>

type FormDialogProps = {
  currentRow?: App.Data.PurchaseData
}
export function FormDialog({ currentRow }: FormDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: new Date(),
      payment_amount: 0,
      status: 1,
      tax: 0,
      discount: 0,
      shipping: 0,
      price: 0,
      total: 0,
      items: [],
      // payment_method_id: null,
      reference: '',
      payment_date: null,
      payment_status: '0',
    },
  })

  const {
    fields,
    append,
    remove,
    update: edit,
  } = useFieldArray({
    control: form.control,
    name: 'items',
  })
  const items = useWatch({
    control: form.control,
    name: 'items',
    defaultValue: [],
  })
  const tax = useWatch({ control: form.control, name: 'tax' })
  const discount = useWatch({ control: form.control, name: 'discount' })
  const shipping = useWatch({ control: form.control, name: 'shipping' })
  const price = useWatch({ control: form.control, name: 'price' })

  const sumItemsQty = items.reduce(
    (sum, item) => Number(sum) + Number(item.quantity || 0),
    0
  )
  const sumItemsDisc = items.reduce(
    (sum, item) => Number(sum) + Number(item.discount || 0),
    0
  )
  const sumSubTotal = (item: ItemForm) =>
    Number(item?.quantity || 0) * Number(item?.price || 0) -
    Number(item?.discount || 0)
  const sumPrice = items.reduce(
    (sum, item) => Number(sum) + Number(sumSubTotal(item)),
    0
  )
  const sumTotal =
    Number(sumPrice) + Number(tax) - Number(discount) + Number(shipping)

  useEffect(() => {
    form.setValue('price', sumPrice || 0)
  }, [form, sumPrice, items])

  useEffect(() => {
    form.setValue('total', sumTotal || 0)
  }, [items, tax, discount, shipping, form, price, sumTotal])

  const [productId, setProductId] = useState<string | null>(null)
  const [searchProduct, setSearchProduct] = useState<string>('')
  const { data: products, isLoading: isProductsLoading } = useQueryApi(
    'Product',
    'product',
    searchProduct,
    { include: 'unit,stock.unit', sort: 'name' }
  )
  const [searchSupplier, setSearchSupplier] = useState<string>('')
  const { data: suppliers, isLoading: isSuppliersLoading } = useQueryApi(
    'Supplier',
    'supplier',
    searchSupplier,
    { sort: 'name' }
  )
  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } =
    useQueryApi('Payment Method', 'payment-method', undefined, { sort: 'name' })

  const addItem = (productId) => {
    // const items = form.getValues('items')
    const index = items.findIndex((f) => f.product_id == productId)
    const product = (products || []).find(
      (f) => f.id == productId
    ) as App.Data.ProductData
    if (product && index < 0) {
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
    if (product && !(index < 0)) {
      edit(index, {
        ...items[index],
        quantity: items[index].quantity + 1,
      })
    }
    // reset
    setProductId(null)
  }

  const addQty = (index) => {
    edit(index, {
      ...items[index],
      quantity: items[index].quantity + 1,
    })
  }
  const subQty = (index) => {
    if (items[index].quantity > 1)
      edit(index, {
        ...items[index],
        quantity: items[index].quantity - 1,
      })
  }

  const { entity, create, update } = useDataProvider()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) =>
      isEdit ? update(currentRow.id, values) : create(values),
    onSuccess: () => {
      form.reset()
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

  const generate = () => {
    form.setValue(
      'reference',
      faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      { shouldValidate: false }
    )
  }

  const pay = () => {
    form.setValue('payment_amount', form.getValues('total'), {
      shouldValidate: false,
    })
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
            className='grid gap-x-4 gap-y-2.5 px-0.5 sm:grid-cols-6 lg:grid-cols-12'
          >
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Purchase Date</FormLabel>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                    className='w-full'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reference'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>
                    No./Ref.<span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <ButtonGroup className='w-full'>
                      <InputGroup>
                        <InputGroupInput {...field} />
                        <InputGroupAddon align='inline-end'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InputGroupButton
                                onClick={() => generate()}
                                size='icon-xs'
                              >
                                <Dices />
                              </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>Generate No./Ref.</TooltipContent>
                          </Tooltip>
                        </InputGroupAddon>
                      </InputGroup>
                    </ButtonGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='supplier_id'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Supplier</FormLabel>
                  <SelectCombobox
                    data={suppliers}
                    search={searchSupplier}
                    onSearchChange={setSearchSupplier}
                    value={field.value}
                    onValueChange={(v) => form.setValue('supplier_id', v)}
                    isLoading={isSuppliersLoading}
                    valueBy='id'
                    labelBy='name'
                    manualFiltering={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className='h-fit items-start sm:col-span-full lg:col-span-full'>
              <FormLabel>Product</FormLabel>
              <ButtonGroup className='w-full'>
                <ButtonGroup>
                  <Button
                    type='button'
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

            <div
              className={cn(
                'overflow-hidden rounded-md border',
                'sm:col-span-full lg:col-span-full'
              )}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className='text-end'>Price</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
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
                            <div>{subfield.value}</div>
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.unit_name`}
                          name={`items.${index}.unit_name`}
                          render={({ field: subfield }) => (
                            <div>{subfield.value}</div>
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-end'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.price`}
                          name={`items.${index}.price`}
                          render={({ field: { value } }) => (
                            <NumberInput
                              className='text-end'
                              value={value}
                              thousandSeparator
                              asText
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-end'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.quantity`}
                          name={`items.${index}.quantity`}
                          render={({ field: { ref, onChange, ...rest } }) => (
                            <FormItem className='justify-end'>
                              <ButtonGroup className=''>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='icon'
                                  onClick={() => {
                                    subQty(index)
                                  }}
                                  disabled={rest.value <= 1}
                                >
                                  <MinusIcon />
                                </Button>

                                <FormControl>
                                  <NumberInput
                                    maxLength={12}
                                    className='max-w-16 text-center'
                                    {...rest}
                                    getInputRef={ref}
                                    thousandSeparator={true}
                                    allowNegative={false}
                                    onValueChange={(v) => {
                                      onChange(v.floatValue)
                                    }}
                                  />
                                </FormControl>

                                <Button
                                  type='button'
                                  variant='outline'
                                  size='icon'
                                  onClick={() => {
                                    addQty(index)
                                  }}
                                >
                                  <PlusIcon />
                                </Button>
                              </ButtonGroup>
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
                          render={({ field: { ref, onChange, ...rest } }) => (
                            <FormItem className='justify-end'>
                              <FormControl>
                                <NumberInput
                                  maxLength={12}
                                  className='max-w-36 text-end'
                                  {...rest}
                                  getInputRef={ref}
                                  thousandSeparator={true}
                                  allowNegative={false}
                                  onValueChange={(v) => {
                                    onChange(v.floatValue)
                                  }}
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
                          render={() => (
                            <NumberInput
                              className='text-end'
                              value={sumSubTotal(items[index]) || 0}
                              thousandSeparator
                              asText
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-end'>
                        <Button
                          className='text-red-500!'
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => remove(index)}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className='text-end font-bold'>
                      Total
                    </TableCell>
                    <TableCell className='ps-9 text-center'>
                      <NumberInput
                        className='text-center font-bold'
                        value={sumItemsQty}
                        thousandSeparator
                        asText
                      />
                    </TableCell>
                    <TableCell className='pe-5 text-end'>
                      <NumberInput
                        className='text-end font-bold'
                        value={sumItemsDisc}
                        thousandSeparator
                        asText
                      />
                    </TableCell>
                    <TableCell className='text-end'>
                      <NumberInput
                        className='text-end font-bold'
                        value={price}
                        thousandSeparator
                        asText
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <FormField
              control={form.control}
              name='discount'
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <NumberInput
                      maxLength={12}
                      className='text-end'
                      {...rest}
                      getInputRef={ref}
                      thousandSeparator={true}
                      allowNegative={false}
                      onValueChange={(v) => {
                        onChange(v.floatValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='shipping'
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Shipping</FormLabel>
                  <FormControl>
                    <NumberInput
                      maxLength={12}
                      className='text-end'
                      {...rest}
                      getInputRef={ref}
                      thousandSeparator={true}
                      allowNegative={false}
                      onValueChange={(v) => {
                        onChange(v.floatValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tax'
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Tax</FormLabel>
                  <FormControl>
                    <NumberInput
                      maxLength={12}
                      className='text-end'
                      {...rest}
                      getInputRef={ref}
                      thousandSeparator={true}
                      allowNegative={false}
                      onValueChange={(v) => {
                        onChange(v.floatValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='total'
              render={({ field: { value } }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Total</FormLabel>
                  <FormControl>
                    <div className='flex h-9 items-center justify-end'>
                      <NumberInput
                        className='px-3 py-1 text-sm font-bold'
                        value={value}
                        thousandSeparator
                        asText
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='col-span-full sm:col-span-full lg:col-span-full'>
              <div className='grid gap-x-4 gap-y-2.5 px-0.5 sm:grid-cols-6 lg:grid-cols-12'>
                <div className='h-fit items-start sm:col-span-3 lg:col-span-3'>
                  <FormField
                    control={form.control}
                    name='payment_method_id'
                    render={({ field: { value, onChange, ...rest } }) => (
                      <FormItem className='h-fit items-start'>
                        <FormLabel>Payment Method</FormLabel>
                        <SelectDropdown
                          {...rest}
                          items={paymentMethods}
                          isPending={isPaymentMethodsLoading}
                          value={value ?? null}
                          onValueChange={(v) => {
                            onChange(v === '' ? null : Number(v))
                          }}
                          valueBy='id'
                          labelBy='name'
                          className='w-full'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='h-fit items-start sm:col-span-3 lg:col-span-3'>
                  <FormField
                    control={form.control}
                    name='payment_status'
                    render={({ field: { value, onChange, ...rest } }) => (
                      <FormItem className='h-fit items-start'>
                        <FormLabel>Payment Status</FormLabel>
                        <SelectDropdown
                          {...rest}
                          items={PaymentStatuses}
                          value={value ?? null}
                          onValueChange={(v) => {
                            onChange(v)
                          }}
                          className='w-full'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='h-fit items-start sm:col-span-3 lg:col-span-3'>
                  <FormField
                    control={form.control}
                    name='payment_date'
                    render={({ field }) => (
                      <FormItem className='h-fit items-start'>
                        <FormLabel>Payment Date</FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          className='w-full'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='h-fit items-start sm:col-span-3 lg:col-span-3'>
                  <FormField
                    control={form.control}
                    name='payment_amount'
                    render={({ field: { ref, onChange, ...rest } }) => (
                      <FormItem className='h-fit items-start'>
                        <FormLabel>Payment Amount</FormLabel>
                        <ButtonGroup className='w-full'>
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => pay()}
                          >
                            <SparklesIcon />
                          </Button>
                          <FormControl>
                            <NumberInput
                              maxLength={12}
                              className='text-end'
                              {...rest}
                              getInputRef={ref}
                              thousandSeparator={true}
                              allowNegative={false}
                              onValueChange={(v) => {
                                onChange(v.floatValue)
                              }}
                            />
                          </FormControl>
                        </ButtonGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-full lg:col-span-full'>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
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
