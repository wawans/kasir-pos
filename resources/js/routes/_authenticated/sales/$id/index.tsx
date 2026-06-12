import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/sales'
import { DetailSales } from '@/features/sales/detail'

export const Route = createFileRoute('/_authenticated/sales/$id/')({
  component: DetailSales,
  pendingComponent: PageSkeleton,
  loader: async ({ params: { id } }) => {
    const { data } = await getOne(EntityURL, id, {
      include: 'items.product,items.unit',
    })
    return { data }
  },
})
