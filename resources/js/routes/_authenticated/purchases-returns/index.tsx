import { createFileRoute } from '@tanstack/react-router'
import { PurchasesReturns } from '@/features/purchases-returns'
import { PageSkeleton } from '@/components/layout/page-skeleton'

export const Route = createFileRoute('/_authenticated/purchases-returns/')({
  component: PurchasesReturns,
  pendingComponent: PageSkeleton,
})
