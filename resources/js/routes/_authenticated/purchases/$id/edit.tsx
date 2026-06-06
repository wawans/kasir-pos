import { createFileRoute } from '@tanstack/react-router'
import { getOne } from '@/components/data/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { EntityURL } from '@/features/purchases'
import { UpdatePurchase } from '@/features/purchases/update'
import { SuppliersQueryOptions } from '@/features/suppliers/components/utils'

export const Route = createFileRoute('/_authenticated/purchases/$id/edit')({
  component: UpdatePurchase,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())
    await queryClient.ensureQueryData(SuppliersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())

    const { data } = await getOne(EntityURL, params.id, {
      include: 'items.product,items.unit',
    })
    return { data }
  },
})
