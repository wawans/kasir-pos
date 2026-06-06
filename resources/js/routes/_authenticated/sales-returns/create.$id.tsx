import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { CreateSalesReturns } from '@/features/sales-returns/create'

export const Route = createFileRoute(
  '/_authenticated/sales-returns/create/$id'
)({
  component: CreateSalesReturns,
  pendingComponent: PageSkeleton,
})
