import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { PageSkeleton } from '@/components/layout/page-skeleton'

export const Route = createFileRoute('/_authenticated/expenses/$id/')({
  component: ComingSoon,
  pendingComponent: PageSkeleton,
})
