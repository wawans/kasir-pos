import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { Sales } from '@/features/sales'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: Sales,
  pendingComponent: PageSkeleton,
})
