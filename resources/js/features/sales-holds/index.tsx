import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

// import { ActionButtons } from './components/action-buttons'

export const Entity: string = 'Hold'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function SalesHolds() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Holds'
      description='Manage your sales holds and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales Holds',
          href: '/sales-holds',
        },
      ]}
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
