import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { EntityURL } from '@/features/purchases'
import { DetailPurchase } from '@/features/purchases/detail'

export const Route = createFileRoute('/_authenticated/purchases/$id/')({
  component: DetailPurchase,
  loader: async ({ params }) => {
    const { data } = await getOne(EntityURL, params.id, {
      include: 'items.product,items.unit',
    })
    return { data }
  },
})
