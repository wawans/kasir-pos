import { createFileRoute } from '@tanstack/react-router'
import { CreatePurchasesReturns } from '@/features/purchases-returns/create'

export const Route = createFileRoute(
  '/_authenticated/purchases-returns/create/$id'
)({
  component: CreatePurchasesReturns,
})
