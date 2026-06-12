import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

export function UpdateSales() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales'
      description='Edit your sales and their information here.'
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
          title: 'Edit',
        },
      ]}
    >
      <FormDialog />
    </Data>
  )
}
