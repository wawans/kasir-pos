import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

// import { ActionButtons } from './components/action-buttons'

export const Entity: string = 'Purchase Return'
export const EntityURL: string = 'purchase-return'

export function PurchasesReturns() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Purchases Returns'
      description='Manage your purchases returns and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Purchases Returns',
          href: '/purchases-returns',
        },
      ]}
    >
      <DataTable
        columns={columns}
        bulkActions={<TableBulkActions />}
        searchKey='id'
        include='supplier,purchase'
      />
      <ActionDialogs />
    </Data>
  )
}
