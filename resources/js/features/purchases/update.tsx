import { getRouteApi } from '@tanstack/react-router'
import { Data } from '@/components/data/data'
import { FormDialog } from './components/form-dialog'

const route = getRouteApi('/_authenticated/purchases/$id/edit')
export function UpdatePurchase() {
  const { id } = route.useParams()

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
      ]}
    >
      <FormDialog />
    </Data>
  )
}
