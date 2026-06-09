import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

const route = getRouteApi('/_authenticated/purchases-returns/create/$id')

export function CreatePurchasesReturns() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Purchases Returns'
      description='Create your purchases returns and their information here.'
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
          title: 'Create',
        },
      ]}
    >
      <FormDialog parentRow={data} />
    </Data>
  )
}
