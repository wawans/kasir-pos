import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/products'
import { DetailProduct } from '@/features/products/detail'

export const Route = createFileRoute('/_authenticated/products/$id/')({
  component: DetailProduct,
  pendingComponent: PageSkeleton,
  loader: async ({ params }) => {
    const { data } = await getOne(EntityURL, params.id, {
      include: 'unit',
    })
    return { data }
  },
})
