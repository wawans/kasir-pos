import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

export function DetailSalesHolds() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Holds'
      description='View your sales holds and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales Holds',
          href: '/sales-holds',
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
