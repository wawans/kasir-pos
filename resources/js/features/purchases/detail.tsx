import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'

const route = getRouteApi('/_authenticated/purchases/$id/')
export function DetailPurchase() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity='Purchase'
      url='purchase'
      title='Purchases'
      description='View your purchases and their information here.'
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
          title: 'Detail',
          href: '/purchases',
        },
      ]}
    >
      <></>
    </Data>
  )
}
