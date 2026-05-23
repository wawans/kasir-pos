import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table.tsx'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export function Units() {
  return (
    <Data
      entity='Unit'
      url='unit'
      title='Units'
      description='Manage your units and their information here.'
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
          title: 'Units',
          href: '/units',
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
