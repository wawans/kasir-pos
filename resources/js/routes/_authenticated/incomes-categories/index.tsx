import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/_authenticated/incomes-categories/')({
  component: ComingSoon,
  pendingComponent: PageSkeleton,
})

