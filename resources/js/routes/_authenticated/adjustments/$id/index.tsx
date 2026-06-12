import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/adjustments'
import { DetailAdjustments } from '@/features/adjustments/detail'

export const Route = createFileRoute('/_authenticated/adjustments/$id/')({
  component: DetailAdjustments,
  pendingComponent: PageSkeleton,
  loader: async ({ params: { id } }) => {
    const { data } = await getOne(EntityURL, id, {
      include: 'items.product,items.unit',
    })
    return { data }
  },
})
