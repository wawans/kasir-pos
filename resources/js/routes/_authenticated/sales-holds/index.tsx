import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { SalesHolds } from '@/features/sales-holds'

export const Route = createFileRoute('/_authenticated/sales-holds/')({
  component: SalesHolds,
  pendingComponent: PageSkeleton,
})
