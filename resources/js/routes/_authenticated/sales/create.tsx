import { createFileRoute } from '@tanstack/react-router'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { CustomersQueryOptions } from '@/features/customers/components/utils'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { CreateSales } from '@/features/sales/create'

export const Route = createFileRoute('/_authenticated/sales/create')({
  component: CreateSales,
  pendingComponent: PageSkeleton,
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(CustomersQueryOptions())
    queryClient.prefetchQuery(ProductsQueryOptions())

    return queryClient.ensureQueryData(PaymentMethodsQueryOptions())
  },
})
