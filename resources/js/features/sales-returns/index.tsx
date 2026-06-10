import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

// import { ActionButtons } from './components/action-buttons'

export const Entity: string = 'Sale Return'
export const EntityURL: string = 'sale-return'

export function SalesReturns() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Sales Returns'
      description='Manage your sales returns and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Sales Returns',
          href: '/sales-returns',
        },
      ]}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='id'
        include='customer,sale'
      />
      <ActionDialogs />
    </Data>
  )
}
