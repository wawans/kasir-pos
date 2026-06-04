import { use, Suspense } from 'react'
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { useDataProvider } from '@/components/data/data-provider'
import { FormDialog } from './components/form-dialog'

const route = getRouteApi('/_authenticated/purchases/edit/$id')
export function UpdatePurchase() {
  const { id } = route.useParams()

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
      ]}
    >
      <Loadable id={id} />
    </Data>
  )
}

function Loadable({ id }) {
  const { entity, getOne } = useDataProvider()
  const { data } = useSuspenseQuery({
    queryKey: [entity, { id }, getOne],
    queryFn: () => getOne(id, { include: 'items' }).then((r) => r?.data),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return (
    <Suspense fallback={<div>Loading</div>}>
      <FormDialog currentRow={data} />
    </Suspense>
  )
}
