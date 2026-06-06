import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { DetailSalesReturns } from '@/features/sales-returns/detail'

export const Route = createFileRoute('/_authenticated/sales-returns/$id/')({
  component: DetailSalesReturns,
  pendingComponent: PageSkeleton,
})
