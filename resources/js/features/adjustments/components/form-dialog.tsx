'use client'

import * as React from 'react'
import { useState } from 'react'
import { z } from 'zod'
import { type AxiosError } from 'axios'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { faker } from '@faker-js/faker'
import { useMount, useUpdateEffect } from '@reactuses/core'
import { Dices, MinusIcon, PlusIcon, Save, Trash2 } from 'lucide-react'
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
import { AdjustmentsCategoriesQueryOptions } from '@/features/adjustments-categories/components/utils'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { type DataForm, formSchema, type ItemForm } from './schema'

type FormDialogProps = {
  currentRow?: App.Data.AdjustmentData
}
export function FormDialog({ currentRow }: FormDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DataForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date(),
      reference: '',
      note: '',
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
  const sumItemsQty = items.reduce(
    (sum, item) => Number(sum) + Number(item.quantity || 0),
    0
  )
  const sumSubTotal = (item: ItemForm) =>
    item?.adjustment_item_type == '1'
      ? Number(item?.stock_quantity || 0) + Number(item?.quantity || 0)
      : Number(item?.stock_quantity || 0) - Number(item?.quantity || 0)

  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    AdjustmentsCategoriesQueryOptions()
  )

  const [productId, setProductId] = useState<string | null>(null)
  const [searchProduct, setSearchProduct] = useState<string>('')
  const { data: products, isLoading: isLoadingProducts } = useQuery(
    ProductsQueryOptions(searchProduct)
  )

  const [isFirstMount, setIsFirstMount] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(() => {
    setIsFirstMount(true)
  })

  useUpdateEffect(() => {
    if (isFirstMount) setIsReady(true)
  }, [isFirstMount, isReady])

  useUpdateEffect(() => {
    function loadValues() {
      const items = (currentRow?.items || []).map((item) => {
        const stock_quantity =
          Number(item?.product.stock?.quantity) -
          (item?.adjustment_item_type == '2'
            ? Number(item?.quantity) * -1
            : Number(item?.quantity) * 1)

        return {
          product_id: item?.product_id,
          product_name: item?.product?.name,
          unit_id: item?.unit_id,
          unit_name: item?.unit?.alias,
          quantity: item?.quantity,
          stock_quantity: stock_quantity,
          remaining_quantity: item?.product.stock?.quantity || 0,
          adjustment_item_type: item?.adjustment_item_type || '1',
        }
      })

      form.reset({
        adjustment_category_id: currentRow?.adjustment_category_id,
        reference: currentRow?.reference || '',
        note: currentRow?.note || '',
        date: currentRow?.date
          ? new Date(currentRow?.date)
          : (null as unknown as Date),
        items: items || [],
      })
    }

    if (isEdit) loadValues()
  }, [currentRow, form, isEdit, isFirstMount])

  const { entity, create, update } = useDataProvider()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DataForm) =>
      isEdit ? update(currentRow.id, values) : create(values),
    onSuccess: (data) => {
      navigate({ to: '/adjustments/$id', params: { id: data.data.id } })
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
      'AS-' + faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      { shouldValidate: false }
    )
  }

  const addItem = (productId) => {
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
        adjustment_item_type: '1',
        stock_quantity: product.stock?.quantity || 0,
        remaining_quantity: (product.stock?.quantity || 1) - 1,
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
                  <FormLabel>Date</FormLabel>
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
              name='adjustment_category_id'
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem className='h-fit items-start sm:col-span-3 lg:col-span-4'>
                  <FormLabel>Category</FormLabel>
                  <SelectDropdown
                    {...rest}
                    items={categories || []}
                    isPending={isLoadingCategories}
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
                    data={products || []}
                    search={searchProduct}
                    onSearchChange={setSearchProduct}
                    value={productId}
                    onValueChange={(v) => setProductId(v)}
                    isLoading={isLoadingProducts}
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
                    <TableHead className='text-end'>Stock</TableHead>
                    <TableHead className='text-center'>Type</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-end'>Remaining</TableHead>
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
                          render={({ field: { value } }) => <div>{value}</div>}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.unit_name`}
                          name={`items.${index}.unit_name`}
                          render={({ field: { value } }) => <div>{value}</div>}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-end'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.stock_quantity`}
                          name={`items.${index}.stock_quantity`}
                          render={({ field: { value } }) => (
                            <NumberInput
                              className='text-end'
                              value={value || 0}
                              thousandSeparator
                              asText
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-center'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.adjustment_item_type`}
                          name={`items.${index}.adjustment_item_type`}
                          render={({ field: { value, onChange, ...rest } }) => (
                            <FormItem className='justify-center'>
                              <SelectDropdown
                                {...rest}
                                items={[
                                  { value: '1', label: '(+) Add' },
                                  { value: '2', label: '(-) Sub' },
                                ]}
                                value={value ?? null}
                                onValueChange={onChange}
                              />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className='h-fit items-start text-end'>
                        <FormField
                          control={form.control}
                          key={`items.${index}.quantity`}
                          name={`items.${index}.quantity`}
                          render={({ field: { ref, onChange, ...rest } }) => (
                            <FormItem className='justify-center'>
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
                          key={`items.${index}.remaining_quantity`}
                          name={`items.${index}.remaining_quantity`}
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
                    <TableCell colSpan={9} className='text-start font-bold'>
                      <span className='pe-1'>[#</span>
                      <NumberInput
                        className='text-center font-bold'
                        value={items.length || 0}
                        thousandSeparator
                        asText
                      />
                      <span className='ps-1'>Item #]</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
