import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { DetailSalesPos } from '@/features/sales-pos/detail'

export const Route = createFileRoute('/_authenticated/sales-pos/$id/')({
  component: DetailSalesPos,
  pendingComponent: PageSkeleton,
})
