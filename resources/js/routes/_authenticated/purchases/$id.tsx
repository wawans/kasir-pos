import { createFileRoute } from '@tanstack/react-router'
import { DetailPurchase } from '@/features/purchases/detail'

export const Route = createFileRoute('/_authenticated/purchases/$id')({
  component: DetailPurchase,
})
