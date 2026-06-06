import { z } from 'zod'

export const itemSchema = z.object({
  product_id: z.coerce.number('invalid').min(1, 'required').default(0),
  unit_id: z.coerce.number('invalid').min(1, 'required').default(0),
  quantity: z.coerce.number('invalid').min(1, 'required').default(0),
  discount: z.coerce.number('invalid').gte(0, 'required').default(0),
  price: z.coerce.number('invalid').gte(0, 'required').default(0),
  subtotal: z.coerce.number('invalid').gte(0, 'required').default(0),
  product_name: z.string().optional().nullish(),
  unit_name: z.string().optional().nullish(),
})
export const formSchema = z.object({
  date: z.date('required'),
  payment_date: z.date('required').nullish(),
  customer_id: z.coerce.number('invalid').min(1, 'required').default(0),
  payment_method_id: z.coerce.number('invalid').min(1, 'required').default(0),
  reference: z.string().min(1, 'required').max(30, 'max 30 characters'),
  note: z.string().optional(),
  status: z.enum(['0', '1']).default('1'),
  payment_status: z.enum(['0', '1']).default('0'),
  payment_amount: z.coerce.number('invalid').gte(0, 'required').default(0),
  tax: z.coerce.number('invalid').gte(0, 'required').default(0),
  discount: z.coerce.number('invalid').gte(0, 'required').default(0),
  shipping: z.coerce.number('invalid').gte(0, 'required').default(0),
  price: z.coerce.number('invalid').gte(0, 'required').default(0),
  total: z.coerce.number('invalid').gte(0, 'required').default(0),
  items: z.array(itemSchema).min(1, 'Add at least one item'),
})

export type ItemForm = z.infer<typeof itemSchema>
export type DataForm = z.infer<typeof formSchema>
