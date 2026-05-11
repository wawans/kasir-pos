import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table.tsx'
import { DataTableBulkActions } from './components/data-table-bulk-actions'
import { usersColumns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'

export function Users() {
  return (
    <Data
      entity='User'
      url='user'
      title='User'
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
      actions={<UsersPrimaryButtons />}
    >
      <DataTable
        columns={usersColumns}
        bulkActions={<DataTableBulkActions />}
      />
      <UsersDialogs />
    </Data>
  )
}
