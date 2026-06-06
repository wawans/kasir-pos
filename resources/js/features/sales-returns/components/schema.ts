import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().min(1, 'name is required.'),
  description: z.string().optional(),
  is_default: z.boolean().default(false).optional(),
})

export type DataForm = z.infer<typeof formSchema>
