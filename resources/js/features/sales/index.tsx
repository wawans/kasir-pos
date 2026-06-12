import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export const Entity: string = 'Sale'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function Sales() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales'
      description='Manage your sales and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales',
          href: '/sales',
        },
      ]}
      actions={<ActionButtons />}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='name'
        include='customer'
      />
      <ActionDialogs />
    </Data>
  )
}
