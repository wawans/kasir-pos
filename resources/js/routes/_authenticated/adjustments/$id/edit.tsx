import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/adjustments'
import { AdjustmentsCategoriesQueryOptions } from '@/features/adjustments-categories/components/utils'
import { UpdateAdjustments } from '@/features/adjustments/update'
import { ProductsQueryOptions } from '@/features/products/components/utils'

export const Route = createFileRoute('/_authenticated/adjustments/$id/edit')({
  component: UpdateAdjustments,
  pendingComponent: PageSkeleton,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    await queryClient.ensureQueryData(AdjustmentsCategoriesQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())

    const { data } = await getOne(EntityURL, id, {
      include: 'category,items.product,items.unit,items.product.stock.unit',
    })
    return { data }
  },
})
