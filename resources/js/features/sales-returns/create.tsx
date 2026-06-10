import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'
import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/sales-returns/create/$id')

export function CreateSalesReturns() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Returns'
      description='Create your sales returns and their information here.'
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
          title: 'Create',
        },
      ]}
    >
      <FormDialog parentRow={data} />
    </Data>
  )
}
