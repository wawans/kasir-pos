import { createFileRoute } from '@tanstack/react-router'
import { DetailPurchasesReturns } from '@/features/purchases-returns/detail'

export const Route = createFileRoute('/_authenticated/purchases-returns/$id/')({
  component: DetailPurchasesReturns,
})
