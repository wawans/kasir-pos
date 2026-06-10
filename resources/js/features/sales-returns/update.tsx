import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

const route = getRouteApi('/_authenticated/sales-returns/$id/edit')
export function UpdateSalesReturns() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Returns'
      description='Edit your sales returns and their information here.'
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
          title: 'Edit',
        },
      ]}
    >
      <FormDialog parentRow={data.sale} currentRow={data} />
    </Data>
  )
}
