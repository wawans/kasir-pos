import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export const Entity: string = 'Customer'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function Customers() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Customer'
      description='Manage your customers and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Customer',
          href: '/customer',
        },
      ]}
      actions={<ActionButtons />}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='name'
      />
      <ActionDialogs />
    </Data>
  )
}
