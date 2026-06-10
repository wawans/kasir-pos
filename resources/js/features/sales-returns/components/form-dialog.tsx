'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { PaymentStatuses } from '@/types'
import { faker } from '@faker-js/faker'
import { useMount, useUpdateEffect } from '@reactuses/core'
import {
  Dices,
  MinusIcon,
  PlusIcon,
  Save,
  SparklesIcon,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { cn } from '@/lib/utils'
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
import { Checkbox } from '@/components/ui/checkbox'
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
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { type DataForm, formSchema, type ItemForm } from './schema'

type FormDialogProps = {
  parentRow: App.Data.SaleData
  currentRow?: App.Data.SaleReturnData
}
export function FormDialog({ parentRow, currentRow }: FormDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: new Date(),
      payment_amount: 0,
      status: '1',
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
  const parent_payment_amount = useWatch({
    control: form.control,
    name: 'parent_payment_amount',
  })
  const parent_tax = useWatch({ control: form.control, name: 'parent_tax' })
  const parent_discount = useWatch({
    control: form.control,
    name: 'parent_discount',
  })
  const parent_shipping = useWatch({
    control: form.control,
    name: 'parent_shipping',
  })
  const parent_price = useWatch({ control: form.control, name: 'parent_price' })
  const parent_total = useWatch({ control: form.control, name: 'parent_total' })

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

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery(
    PaymentMethodsQueryOptions()
  )

  const [searchCustomer, setSearchCustomer] = useState<string>('')
  const isLoadingCustomers = false
  const customers = [parentRow.customer]

  const [isFirstMount, setIsFirstMount] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(() => {
    setIsFirstMount(true)
  })

  useUpdateEffect(() => {
    if (isFirstMount) setIsReady(true)
  }, [isFirstMount, isReady])

  const initValues = () => {
    const items = parentRow?.items?.map((item) => {
      return {
        product_id: item?.product_id,
        product_name: item?.product?.name || '',
        unit_id: item?.unit_id,
        unit_name: item?.unit?.alias || '',
        item_quantity: item?.quantity,
        quantity: item?.quantity,
        item_discount: item?.discount,
        discount: item?.discount,
        price: item?.price,
        subtotal: item?.subtotal,
      }
    })

    form.setValue(
      'payment_method_id',
      parentRow.payment_method?.id || (null as unknown as number)
    )
    form.setValue(
      'customer_id',
      parentRow.customer?.id || (null as unknown as number)
    )
    form.setValue('payment_amount', parentRow?.payment_amount || 0)
    form.setValue('tax', parentRow?.tax || 0)
    form.setValue('discount', parentRow?.discount || 0)
    form.setValue('shipping', parentRow?.shipping || 0)
    form.setValue('price', parentRow?.price || 0)
    form.setValue('total', parentRow?.total || 0)
    form.setValue('items', items || [])

    form.setValue('parent_payment_amount', parentRow?.payment_amount || 0)
    form.setValue('parent_tax', parentRow?.tax || 0)
    form.setValue('parent_discount', parentRow?.discount || 0)
    form.setValue('parent_shipping', parentRow?.shipping || 0)
    form.setValue('parent_price', parentRow?.price || 0)
    form.setValue('parent_total', parentRow?.total || 0)
  }

  useUpdateEffect(() => {
    if (!isEdit && isFirstMount && isReady) initValues()
  }, [form, isEdit, isFirstMount, isReady])

  useUpdateEffect(() => {
    function loadValues() {
      initValues()

      form.setValue('reference', currentRow?.reference || '')
      form.setValue('note', currentRow?.note || '')
      form.setValue(
        'status',
        (currentRow?.status as App.Enums.StatusType) || '1'
      )
      form.setValue('payment_status', currentRow?.payment_status || '0')
      form.setValue(
        'payment_date',
        currentRow?.payment_date
          ? new Date(currentRow?.payment_date)
          : (null as unknown as Date)
      )
      form.setValue(
        'date',
        currentRow?.date
          ? new Date(currentRow?.date)
          : (null as unknown as Date)
      )

      form.setValue(
        'payment_method_id',
        currentRow?.payment_method_id || (null as unknown as number)
      )
      form.setValue(
        'customer_id',
        currentRow?.customer_id || (null as unknown as number)
      )
      form.setValue('payment_amount', currentRow?.payment_amount || 0)
      form.setValue('tax', currentRow?.tax || 0)
      form.setValue('discount', currentRow?.discount || 0)
      form.setValue('shipping', currentRow?.shipping || 0)
      form.setValue('price', currentRow?.price || 0)
      form.setValue('total', currentRow?.total || 0)

      const items = parentRow?.items?.map((item) => {
        const r = currentRow?.items?.find(
          (f) => f.product_id == item.product_id
        )

        return {
          product_id: item?.product_id,
          product_name: item?.product?.name || '',
          unit_id: item?.unit_id,
          unit_name: item?.unit?.alias || '',
          quantity: r ? r?.quantity : 0,
          discount: r ? r?.discount : 0,
          price: r ? r?.price : 0,
          subtotal: r ? r?.subtotal : 0,
          item_quantity: item?.quantity,
          item_discount: item?.discount,
        }
      })

      form.setValue('items', items || [])
    }

    if (isEdit) loadValues()
  }, [currentRow, form, isEdit, isFirstMount])

  const { entity, url, client, update } = useDataProvider()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) =>
      isEdit
        ? update(currentRow.id, values)
        : client('post', `${url}/${parentRow.id}`, values),
    onSuccess: (data) => {
      navigate({
        to: '/sales-returns/$id',
        params: { id: data?.data?.data?.id || data?.data?.id || data?.id },
      })
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

  const generate = () => {
    form.setValue(
      'reference',
      'SR-' + faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      { shouldValidate: false }
    )
  }

  const pay = () => {
    form.setValue('payment_amount', form.getValues('total'), {
      shouldValidate: false,
    })
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
            onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
            className='grid gap-x-4 gap-y-2.5 px-0.5 sm:grid-cols-6 lg:grid-cols-12'
          >
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Sale Return Date</FormLabel>
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
              name='customer_id'
              render={({ field }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Customer</FormLabel>
                  <SelectCombobox
                    data={customers || []}
                    search={searchCustomer}
                    onSearchChange={setSearchCustomer}
                    value={field.value}
                    onValueChange={(v) => form.setValue('customer_id', v)}
                    isLoading={isLoadingCustomers}
                    valueBy='id'
                    labelBy='name'
                    manualFiltering={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <TableHead className='text-end'>Sale Qty</TableHead>
                    <TableHead className='text-end'>Ret. Qty</TableHead>
                    <TableHead className='text-end'>Sale Disc.</TableHead>
                    <TableHead className='text-end'>Ret. Disc.</TableHead>
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
                          key={`items.${index}.item_quantity`}
                          name={`items.${index}.item_quantity`}
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
                          key={`items.${index}.item_discount`}
                          name={`items.${index}.item_discount`}
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
                    <TableCell colSpan={4} className='text-end font-bold'>
                      Total
                    </TableCell>
                    <TableCell className='ps-9 text-end'>
                      <NumberInput
                        className='text-end font-bold'
                        value={sumItemsQty}
                        thousandSeparator
                        asText
                      />
                    </TableCell>
                    <TableCell />
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
            <div className='col-span-full sm:col-span-full lg:col-span-full'>
              <FormField
                control={form.control}
                name='items'
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-full sm:col-span-full lg:col-span-full'>
              <div className='grid gap-x-4 gap-y-2.5 px-0.5 sm:grid-cols-6 lg:grid-cols-12'>
                <FormField
                  control={form.control}
                  name='discount'
                  render={({ field: { ref, onChange, ...rest } }) => (
                    <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-3'>
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
                      <FormDescription className='px-3 text-end'>
                        <span className='pe-1'>Max:</span>
                        <NumberInput
                          className='text-sm text-destructive'
                          value={parent_discount}
                          thousandSeparator
                          asText
                        />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='shipping'
                  render={({ field: { ref, onChange, ...rest } }) => (
                    <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-3'>
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
                      <FormDescription className='px-3 text-end'>
                        <span className='pe-1'>Max:</span>
                        <NumberInput
                          className='text-sm text-destructive'
                          value={parent_shipping}
                          thousandSeparator
                          asText
                        />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='tax'
                  render={({ field: { ref, onChange, ...rest } }) => (
                    <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-3'>
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
                      <FormDescription className='px-3 text-end'>
                        <span className='pe-1'>Max:</span>
                        <NumberInput
                          className='text-sm text-destructive'
                          value={parent_tax}
                          thousandSeparator
                          asText
                        />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='total'
                  render={({ field: { value } }) => (
                    <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-3'>
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
                      <FormDescription className='px-3 text-end'>
                        <span className='pe-1'>Max:</span>
                        <NumberInput
                          className='text-sm text-destructive'
                          value={parent_total}
                          thousandSeparator
                          asText
                        />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                          items={paymentMethods || []}
                          isPending={isLoadingPaymentMethods}
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
