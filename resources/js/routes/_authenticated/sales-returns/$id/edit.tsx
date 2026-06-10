import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { UpdateSalesReturns } from '@/features/sales-returns/update'
import { EntityURL } from '@/features/sales-returns'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { getOne } from '@/components/data/utils'

export const Route = createFileRoute('/_authenticated/sales-returns/$id/edit')({
  component: UpdateSalesReturns,
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
