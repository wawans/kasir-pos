import { z } from 'zod'

export const formSchema = z.object({
  //
})

export type DataForm = z.infer<typeof formSchema>
