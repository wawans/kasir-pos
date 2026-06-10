import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { EntityURL } from '@/features/sales'
import { CreateSalesReturns } from '@/features/sales-returns/create'

export const Route = createFileRoute(
  '/_authenticated/sales-returns/create/$id'
)({
  component: CreateSalesReturns,
  pendingComponent: PageSkeleton,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())
    await queryClient.ensureQueryData(CustomersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())

    const { data } = await getOne(EntityURL, params.id, {
      include: 'items.product,items.unit,customer,paymentMethod,payments',
    })
    return { data }
  },
})
