import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { UpdateSalesReturns } from '@/features/sales-returns/update'

export const Route = createFileRoute('/_authenticated/sales-returns/$id/edit')({
  component: UpdateSalesReturns,
  pendingComponent: PageSkeleton,
})
