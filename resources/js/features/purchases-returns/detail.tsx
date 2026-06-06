import { Data } from '@/components/data/data'
import { Entity, EntityURL } from './index'

export function DetailPurchasesReturns() {
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
