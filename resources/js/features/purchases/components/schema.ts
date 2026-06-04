import { z } from 'zod'

export const itemSchema = z.object({
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

export const formSchema = z.object({
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

export type ItemForm = z.infer<typeof itemSchema>
export type DataForm = z.infer<typeof formSchema>
