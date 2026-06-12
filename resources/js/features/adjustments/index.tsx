import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export const Entity: string = 'Adjustment'
// eslint-disable-next-line react-refresh/only-export-components
export const EntityURL: string = Entity.toLowerCase()

export function Adjustments() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Stocks Adjustments'
      description='Manage your stocks adjustments and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Adjustments',
          href: '/adjustments',
        },
      ]}
      actions={<ActionButtons />}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='name'
        include='category'
      />
      <ActionDialogs />
    </Data>
  )
}
