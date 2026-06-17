import { createFileRoute } from '@tanstack/react-router'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { Pos } from '@/features/pos'
import { ProductsQueryOptions } from '@/features/products/components/utils'

export const Route = createFileRoute('/_authenticated/pos/')({
  component: Pos,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(CustomersQueryOptions())
    await queryClient.ensureQueryData(ProductsQueryOptions())
    await queryClient.ensureQueryData(PaymentMethodsQueryOptions())
  },
})
