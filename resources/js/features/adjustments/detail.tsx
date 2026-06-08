import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

const route = getRouteApi('/_authenticated/adjustments/$id/')
export function DetailAdjustments() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Stocks Adjustments'
      description='View your stocks adjustments and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Adjustments',
          href: '/adjustments',
        },
        {
          title: 'Detail',
        },
      ]}
    >
      <h1>Detail</h1>
    </Data>
  )
}
