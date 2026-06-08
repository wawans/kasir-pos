import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

const route = getRouteApi('/_authenticated/adjustments/$id/edit')
export function UpdateAdjustments() {
  const { data } = route.useLoaderData()

  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Stocks Adjustments'
      description='Edit your stocks adjustments and their information here.'
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
          title: 'Edit',
        },
      ]}
    >
      <FormDialog currentRow={data} />
    </Data>
  )
}
