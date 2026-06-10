import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'
import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/sales-returns/$id/')
export function DetailSalesReturns() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Returns'
      description='View your sales returns and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales Returns',
          href: '/sales-returns',
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
