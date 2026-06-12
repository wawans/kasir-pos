import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { EntityURL } from '@/features/sales-returns'
import { DetailSalesReturns } from '@/features/sales-returns/detail'

export const Route = createFileRoute('/_authenticated/sales-returns/$id/')({
  component: DetailSalesReturns,
  pendingComponent: PageSkeleton,
  loader: async ({ params }) => {
    const { data } = await getOne(EntityURL, params.id, {
      include: [
        'items.product',
        'items.unit',
        'customer',
        'paymentMethod',
        'payments',
        'sale.items.product',
        'sale.items.unit',
        'sale.customer',
        'sale.paymentMethod',
        'sale.payments',
      ].join(','),
    })
    return { data }
  },
})
