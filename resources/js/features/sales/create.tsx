import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

export function CreateSales() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales'
      description='Create your sales and their information here.'
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
          title: 'Create',
        },
      ]}
    >
      <FormDialog />
    </Data>
  )
}
