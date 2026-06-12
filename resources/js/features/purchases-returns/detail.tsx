import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

const route = getRouteApi('/_authenticated/purchases-returns/$id/')

export function DetailPurchasesReturns() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Purchases Returns'
      description='View your purchases returns and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Purchases Returns',
          href: '/purchases-returns',
        },
        {
          title: 'Detail',
        },
      ]}
    >
      <></>
    </Data>
  )
}
