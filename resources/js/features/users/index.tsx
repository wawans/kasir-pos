import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export function Users() {
  return (
    <Data
      entity='User'
      url='user'
      title='Users'
      description='Manage your users and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Users',
          href: '/users',
        },
      ]}
      actions={<ActionButtons />}
    >
      <DataTable<App.Data.UserData>
        columns={columns}
        bulkActions={<TableBulkActions />}
      />
      <ActionDialogs />
    </Data>
  )
}
