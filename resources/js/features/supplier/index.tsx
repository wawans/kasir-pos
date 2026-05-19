import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table.tsx'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export function Supplier() {
  return (
    <Data
      entity='Supplier'
      url='supplier'
      title='Supplier'
      description='Manage your suppliers and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Supplier',
          href: '/supplier',
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
