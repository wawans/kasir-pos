import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

// import { ActionButtons } from './components/action-buttons'

export const Entity: string = 'Pos'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function SalesPos() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales POS'
      description='Manage your sales POS and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales POS',
          href: '/sales-pos',
        },
      ]}
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
