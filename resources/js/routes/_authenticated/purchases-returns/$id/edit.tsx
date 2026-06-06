import { createFileRoute } from '@tanstack/react-router'
import { UpdatePurchasesReturns } from '@/features/purchases-returns/update'

export const Route = createFileRoute(
  '/_authenticated/purchases-returns/$id/edit'
)({
  component: UpdatePurchasesReturns,
})
