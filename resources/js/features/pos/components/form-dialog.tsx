'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PaymentStatuses } from '@/types'
import { faker } from '@faker-js/faker'
import { useMount, useUpdateEffect } from '@reactuses/core'
import {
  DollarSign,
  Hand,
  MinusIcon,
  PlusIcon,
  Trash2,
  Tag,
  PercentCircle,
  SparklesIcon,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'
import { type LaravelValidationError } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useDataProvider } from '@/components/data/data-provider'
import { DatePicker } from '@/components/date-picker'
import { NumberInput } from '@/components/form/number-input'
import { SelectCombobox } from '@/components/select-combobox'
import { SelectDropdown } from '@/components/select-dropdown'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { EntityURL as SaleURL } from '@/features/sales'
import { EntityURL as HoldURL } from '@/features/sales-holds'
import {
  type DataForm,
  formSchema,
  type ItemForm,
} from '@/features/sales/components/schema'
import { Products } from './products'

export function FormDialog() {
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: new Date(),
      payment_date: new Date(),
      reference: '',
      note: '',
      status: '1',
      payment_status: '1',
      payment_amount: 0,
      tax: 0,
      discount: 0,
      shipping: 0,
      price: 0,
      total: 0,
      items: [],
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
  }, [form, items, sumPrice])

  useEffect(() => {
    form.setValue('total', sumTotal || 0)
  }, [form, items, tax, discount, shipping, sumPrice, sumTotal])

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery(
    PaymentMethodsQueryOptions()
  )

  const [searchCustomer, setSearchCustomer] = useState<string>('')
  const { data: customers, isLoading: isLoadingCustomers } = useQuery(
    CustomersQueryOptions(searchCustomer)
  )

  const [isFirstMount, setIsFirstMount] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  const generate = () => {
    form.setValue(
      'reference',
      'SA-' + faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      { shouldValidate: false }
    )
  }

  const reset = () => {
    const payment_method = (paymentMethods || []).find((f) => f.is_default)
    const customer = (customers || []).find((f) => f.is_default)

    form.setValue('payment_method_id', payment_method?.id || null)
    form.setValue('customer_id', customer?.id || null)
    generate()
  }

  useMount(() => {
    setIsFirstMount(true)
  })

  useUpdateEffect(() => {
    if (isFirstMount) setIsReady(true)
  }, [isFirstMount, isReady])

  useUpdateEffect(() => {
    if (isFirstMount && isReady) reset()
  }, [isFirstMount, isReady])

  const onError = ({ response }: AxiosError<LaravelValidationError>) => {
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
  }

  const { entity, client } = useDataProvider()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) => client('POST', SaleURL, values),
    onSuccess: () => {
      reset()
    },
    onError: onError,
  })
  const { mutate: hold, isPending: isHolding } = useMutation({
    mutationFn: (values: DataForm) => client('POST', HoldURL, values),
    onSuccess: () => {
      reset()
    },
    onError: onError,
  })

  const onSubmit = (values: DataForm) => {
    form.clearErrors()
    mutate(values)
  }

  const onHold = (values: DataForm) => {
    form.clearErrors()
    hold(values)
  }

  const pay = () => {
    form.setValue('payment_amount', form.getValues('total'), {
      shouldValidate: false,
    })
  }

  const addItem = (product: App.Data.ProductData) => {
    const index = items.findIndex((f) => f.product_id == product.id)
    if (index < 0) {
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
    if (!(index < 0)) {
      edit(index, {
        ...items[index],
        quantity: items[index].quantity + 1,
      })
    }
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
    <div className='grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6'>
      <div className='col-span-12 sm:col-span-6 lg:col-span-8'>
        <Products onClick={addItem} />
      </div>
      <div className='max-sm:block sm:sticky sm:top-20 sm:col-span-6 sm:self-start lg:col-span-4'>
        <Form {...form}>
          <form
            id={`${entity}-form`}
            onSubmit={form.handleSubmit(onSubmit)}
            className=''
          >
            <Card className='gap-4'>
              <CardHeader className='border-b px-4 [.border-b]:pb-4'>
                <FormField
                  control={form.control}
                  name='customer_id'
                  render={({ field }) => (
                    <FormItem className='h-fit items-start'>
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
              </CardHeader>
              <CardContent className='px-4'>
                <div className='space-y-1'>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex items-center gap-3 gap-x-2'
                    >
                      <div className='flex shrink-0'>
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
                                  className='w-6!'
                                >
                                  <MinusIcon />
                                </Button>

                                <FormControl>
                                  <NumberInput
                                    maxLength={12}
                                    className='max-w-9 px-0! text-center'
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
                                  className='w-6!'
                                >
                                  <PlusIcon />
                                </Button>
                              </ButtonGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='flex flex-1 flex-wrap items-center justify-between'>
                        <div className='space-y-0.5 py-px'>
                          <FormField
                            control={form.control}
                            key={`items.${index}.product_name`}
                            name={`items.${index}.product_name`}
                            render={({ field: { value } }) => (
                              <p className='text-sm leading-none font-medium'>
                                {value}
                              </p>
                            )}
                          />
                          <div className='flex items-center gap-x-2'>
                            <FormField
                              control={form.control}
                              key={`items.${index}.price`}
                              name={`items.${index}.price`}
                              render={({ field: { value } }) => (
                                <div
                                  title='Price'
                                  className='flex items-center justify-center gap-x-0.5 align-middle'
                                >
                                  <span>
                                    <Tag className='-mb-0.5 size-3 text-muted-foreground' />
                                  </span>
                                  <span>
                                    <NumberInput
                                      className='text-xs text-muted-foreground'
                                      value={value}
                                      thousandSeparator
                                      asText
                                    />{' '}
                                  </span>
                                </div>
                              )}
                            />

                            <FormField
                              control={form.control}
                              key={`items.${index}.discount`}
                              name={`items.${index}.discount`}
                              render={({ field: { value } }) => (
                                <div
                                  title='Discount'
                                  className='flex items-center justify-center gap-x-0.5 align-middle'
                                >
                                  <span>
                                    <PercentCircle className='-mb-0.5 size-3 text-muted-foreground' />
                                  </span>
                                  <span>
                                    <NumberInput
                                      className='text-xs text-muted-foreground'
                                      value={value}
                                      thousandSeparator
                                      asText
                                    />{' '}
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div className=''>
                          <FormField
                            control={form.control}
                            key={`items.${index}.subtotal`}
                            name={`items.${index}.subtotal`}
                            render={() => (
                              <NumberInput
                                className='text-end text-sm'
                                value={sumSubTotal(items[index]) || 0}
                                thousandSeparator
                                asText
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className=''>
                        <Button
                          className='text-red-500!'
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => remove(index)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardContent className='space-y-1 px-4'>
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field: { value } }) => (
                    <FormItem className='grid h-fit items-center sm:grid-cols-2'>
                      <FormLabel>Subtotal</FormLabel>
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
                <FormField
                  control={form.control}
                  name='discount'
                  render={({ field: { ref, onChange, ...rest } }) => (
                    <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
                  name='tax'
                  render={({ field: { ref, onChange, ...rest } }) => (
                    <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
                    <FormItem className='grid h-fit items-center sm:grid-cols-2'>
                      <FormLabel>Total</FormLabel>
                      <FormControl>
                        <div className='flex h-9 items-center justify-end'>
                          <NumberInput
                            className='px-3 py-1 text-base font-bold text-destructive'
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
                <div className='mt-4 space-y-1 sm:mt-5 lg:mt-6'>
                  <div className='h-fit items-start'>
                    <FormField
                      control={form.control}
                      name='payment_method_id'
                      render={({ field: { value, onChange, ...rest } }) => (
                        <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
                  <div className='h-fit items-start'>
                    <FormField
                      control={form.control}
                      name='payment_status'
                      render={({ field: { value, onChange, ...rest } }) => (
                        <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
                  <div className='h-fit items-start'>
                    <FormField
                      control={form.control}
                      name='payment_date'
                      render={({ field }) => (
                        <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
                  <div className='h-fit items-start'>
                    <FormField
                      control={form.control}
                      name='payment_amount'
                      render={({ field: { ref, onChange, ...rest } }) => (
                        <FormItem className='grid h-fit items-center sm:grid-cols-2'>
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
              </CardContent>
              <CardFooter className='flex items-center justify-between gap-x-4 border-t px-4'>
                <Button
                  className='flex-1'
                  type='submit'
                  form={`${entity}-form`}
                  disabled={isPending || isHolding}
                >
                  {isPending ? <Spinner /> : <DollarSign />}
                  <span className='flex-1'>Checkout</span>
                </Button>
                <Button
                  className='flex-1'
                  variant='destructive'
                  type='button'
                  form={`${entity}-form`}
                  disabled={isPending || isHolding}
                  onClick={form.handleSubmit(onHold)}
                >
                  {isHolding ? <Spinner /> : <Hand />}

                  <span className='flex-1'>Hold</span>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}
