import { createFileRoute } from '@tanstack/react-router'
import { PurchasesReturns } from '@/features/purchases-returns'

export const Route = createFileRoute('/_authenticated/purchases-returns/')({
  component: PurchasesReturns,
})
