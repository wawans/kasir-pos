import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'
import { Entity, EntityURL } from './index'

export function CreateAdjustments() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Stocks Adjustments'
      description='Create your stocks adjustments and their information here.'
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
          title: 'Create',
        },
      ]}
    >
      <FormDialog />
    </Data>
  )
}
