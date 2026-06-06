import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { SalesPos } from '@/features/sales-pos'

export const Route = createFileRoute('/_authenticated/sales-pos/')({
  component: SalesPos,
  pendingComponent: PageSkeleton,
})
