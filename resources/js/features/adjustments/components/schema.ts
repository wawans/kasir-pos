import { z } from 'zod'

export const itemSchema = z.object({
  product_id: z.coerce.number('invalid').min(1, 'required').default(0),
  unit_id: z.coerce.number('invalid').min(1, 'required').default(0),
  quantity: z.coerce.number('invalid').min(1, 'required').default(0),
  adjustment_item_type: z.enum(['1', '2']).default('1'),
  product_name: z.string().optional().nullish(),
  unit_name: z.string().optional().nullish(),
  stock_quantity: z.coerce.number('invalid').min(1, 'required').default(0),
  remaining_quantity: z.coerce.number('invalid').min(1, 'required').default(0),
})
export const formSchema = z.object({
  date: z.date('required'),
  adjustment_category_id: z.coerce
    .number('invalid')
    .min(1, 'required')
    .default(0),
  reference: z.string().min(1, 'required').max(30, 'max 30 characters'),
  note: z.string().optional(),
  adjustment_total_quantity: z.coerce
    .number('invalid')
    .gte(0, 'required')
    .default(0),
  items: z.array(itemSchema).min(1, 'Add at least one item'),
})

export type ItemForm = z.infer<typeof itemSchema>
export type DataForm = z.infer<typeof formSchema>
