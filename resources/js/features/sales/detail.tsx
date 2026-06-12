import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

export function DetailSales() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales'
      description='View your sales and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales',
          href: '/sales',
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
