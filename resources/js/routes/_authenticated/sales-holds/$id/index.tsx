import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { DetailSalesHolds } from '@/features/sales-holds/detail'

export const Route = createFileRoute('/_authenticated/sales-holds/$id/')({
  component: DetailSalesHolds,
  pendingComponent: PageSkeleton,
})
