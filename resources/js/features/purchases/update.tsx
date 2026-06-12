import { use, Suspense } from 'react'
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { useDataProvider } from '@/components/data/data-provider'
import { PaymentMethodsQueryOptions } from '@/features/payment-methods/components/utils'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { SuppliersQueryOptions } from '@/features/suppliers/components/utils'
import { FormDialog } from './components/form-dialog'

const route = getRouteApi('/_authenticated/purchases/$id/edit')
export function UpdatePurchase() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity='Purchase'
      url='purchase'
      title='Purchases'
      description='Edit your purchases and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Purchases',
          href: '/purchases',
        },
        {
          title: 'Edit',
        },
      ]}
    >
      <Suspense fallback={<div>Loading</div>}>
        <FormDialog currentRow={data} />
      </Suspense>
    </Data>
  )
}
