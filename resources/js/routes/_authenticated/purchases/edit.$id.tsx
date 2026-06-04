import { createFileRoute } from '@tanstack/react-router'
import { UpdatePurchase } from '@/features/purchases/update'

export const Route = createFileRoute('/_authenticated/purchases/edit/$id')({
  component: UpdatePurchase,
})
