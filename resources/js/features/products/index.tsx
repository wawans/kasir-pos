import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export const Entity: string = 'Product'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function Products() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Product'
      description='Manage your products and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Products',
          href: '/products',
        },
      ]}
      actions={<ActionButtons />}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='name'
        include='stock.unit,brand,category'
      />
      <ActionDialogs />
    </Data>
  )
}
