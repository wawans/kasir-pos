import { createFileRoute } from '@tanstack/react-router'
import { CreatePurchase } from '@/features/purchases/create'

export const Route = createFileRoute('/_authenticated/purchases/create')({
  component: CreatePurchase,
})
