import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'

export function CreatePurchase() {
  return (
    <Data
      entity='Purchase'
      url='purchase'
      title='Purchases'
      description='Manage your purchases and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Purchases',
          href: '/purchases',
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
