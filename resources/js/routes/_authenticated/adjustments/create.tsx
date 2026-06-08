import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { AdjustmentsCategoriesQueryOptions } from '@/features/adjustments-categories/components/utils'
import { CreateAdjustments } from '@/features/adjustments/create'
import { ProductsQueryOptions } from '@/features/products/components/utils'

export const Route = createFileRoute('/_authenticated/adjustments/create')({
  component: CreateAdjustments,
  pendingComponent: PageSkeleton,
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(AdjustmentsCategoriesQueryOptions())
    queryClient.prefetchQuery(ProductsQueryOptions())
  },
})
