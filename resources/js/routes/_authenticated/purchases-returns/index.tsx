import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { PurchasesReturns } from '@/features/purchases-returns'

export const Route = createFileRoute('/_authenticated/purchases-returns/')({
  component: PurchasesReturns,
  pendingComponent: PageSkeleton,
})
