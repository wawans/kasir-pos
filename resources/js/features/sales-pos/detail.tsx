import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

export function DetailSalesPos() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales POS'
      description='View your sales POS and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales POS',
          href: '/sales-pos',
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
