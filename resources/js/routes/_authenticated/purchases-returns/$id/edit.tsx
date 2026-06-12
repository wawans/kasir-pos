import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { EntityURL } from '@/features/purchases-returns'
import { UpdatePurchasesReturns } from '@/features/purchases-returns/update'
import { SuppliersQueryOptions } from '@/features/suppliers/components/utils'

export const Route = createFileRoute(
  '/_authenticated/purchases-returns/$id/edit'
)({
  component: UpdatePurchasesReturns,
  pendingComponent: PageSkeleton,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())
    await queryClient.ensureQueryData(SuppliersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())

    const { data } = await getOne(EntityURL, params.id, {
      include:
        'items.product,items.unit,supplier,paymentMethod,payments,purchase,' +
        'purchase.items.product,purchase.items.unit,purchase.supplier,purchase.paymentMethod,purchase.payments',
    })
    return { data }
  },
})
