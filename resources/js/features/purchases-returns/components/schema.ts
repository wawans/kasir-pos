import { z } from 'zod'
import {
  formSchema as form,
  itemSchema as item,
} from '@/features/purchases/components/schema'

export const itemSchema = item.extend({
  item_quantity: z.coerce.number().default(0),
  item_discount: z.coerce.number().default(0),
})

export const formSchema = form.extend({
  parent_payment_amount: z.coerce.number().default(0),
  parent_tax: z.coerce.number().default(0),
  parent_discount: z.coerce.number().default(0),
  parent_shipping: z.coerce.number().default(0),
  parent_price: z.coerce.number().default(0),
  parent_total: z.coerce.number().default(0),
})

export type ItemForm = z.infer<typeof itemSchema>
export type DataForm = z.infer<typeof formSchema>
