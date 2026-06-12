import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { SalesReturns } from '@/features/sales-returns'

export const Route = createFileRoute('/_authenticated/sales-returns/')({
  component: SalesReturns,
  pendingComponent: PageSkeleton,
})
