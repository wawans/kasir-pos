import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

export function UpdateSalesReturns() {
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
      <FormDialog />
    </Data>
  )
}
