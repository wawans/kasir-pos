import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { EntityURL } from '@/features/purchases'
import { CreatePurchasesReturns } from '@/features/purchases-returns/create'
import { SuppliersQueryOptions } from '@/features/suppliers/components/utils'

export const Route = createFileRoute(
  '/_authenticated/purchases-returns/create/$id'
)({
  component: CreatePurchasesReturns,
  pendingComponent: PageSkeleton,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())
    await queryClient.ensureQueryData(SuppliersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())

    const { data } = await getOne(EntityURL, params.id, {
      include: 'items.product,items.unit,supplier,paymentMethod,payments',
    })
    return { data }
  },
})
