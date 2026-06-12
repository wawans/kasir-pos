import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { EntityURL } from '@/features/sales'
import { UpdateSales } from '@/features/sales/update'

export const Route = createFileRoute('/_authenticated/sales/$id/edit')({
  component: UpdateSales,
  pendingComponent: PageSkeleton,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    await queryClient.ensureQueryData(CustomersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())

    const { data } = await getOne(EntityURL, id, {
      include: 'items.product,items.unit',
    })
    return { data }
  },
})
