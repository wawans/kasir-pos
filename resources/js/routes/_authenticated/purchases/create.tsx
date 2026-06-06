import { createFileRoute } from '@tanstack/react-router'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { CreatePurchase } from '@/features/purchases/create'
import { SuppliersQueryOptions } from '@/features/suppliers/components/utils'

export const Route = createFileRoute('/_authenticated/purchases/create')({
  component: CreatePurchase,
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(SuppliersQueryOptions())
    queryClient.prefetchQuery(ProductsQueryOptions())

    return queryClient.ensureQueryData(PaymentMethodsQueryOptions())
  },
})
