import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table.tsx'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export function Purchases() {
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
