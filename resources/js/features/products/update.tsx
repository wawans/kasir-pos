import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from '@/features/products/components/action-buttons'
import { ActionDialogs } from '@/features/products/components/action-dialogs'
import { TableBulkActions } from '@/features/products/components/table-bulk-actions'
import { columns } from '@/features/products/components/table-columns'
import { Entity, EntityURL } from '@/features/products/index'

export function UpdateProduct() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Product'
      description='Edit your products and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Products',
          href: '/products',
        },
        {
          title: 'Edit',
          href: '/products',
        },
      ]}
    >
      <h1>Edit</h1>
    </Data>
  )
}
