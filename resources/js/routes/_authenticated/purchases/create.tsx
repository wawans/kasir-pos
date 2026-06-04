import { createFileRoute } from '@tanstack/react-router'
import {
  PaymentMethodsQueryOptions,
  ProductsQueryOptions,
  SuppliersQueryOptions,
} from '@/features/purchases/components/form-dialog'
import { CreatePurchase } from '@/features/purchases/create'

export const Route = createFileRoute('/_authenticated/purchases/create')({
  component: CreatePurchase,
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(PaymentMethodsQueryOptions())
    queryClient.prefetchQuery(SuppliersQueryOptions())
    queryClient.prefetchQuery(ProductsQueryOptions())
  },
})
