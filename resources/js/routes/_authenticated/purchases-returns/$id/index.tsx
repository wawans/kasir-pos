import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/purchases-returns'
import { DetailPurchasesReturns } from '@/features/purchases-returns/detail'

export const Route = createFileRoute('/_authenticated/purchases-returns/$id/')({
  component: DetailPurchasesReturns,
  pendingComponent: PageSkeleton,
  loader: async ({ params }) => {
    const { data } = await getOne(EntityURL, params.id, {
      include:
        'items.product,items.unit,supplier,paymentMethod,payments,purchase,' +
        'purchase.items.product,purchase.items.unit,purchase.supplier,purchase.paymentMethod,purchase.payments',
    })
    return { data }
  },
})
