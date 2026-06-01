import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { ActionButtons } from './components/action-buttons'
import { ActionDialogs } from './components/action-dialogs'
import { TableBulkActions } from './components/table-bulk-actions'
import { columns } from './components/table-columns'

export function AdjustmentsCategories() {
  return (
    <Data
      entity='Adjustment Category'
      url='adjustment-category'
      title='Adjustments Categories'
      description='Manage your adjustments categories and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Stocks',
          href: '/stocks',
        },
        {
          title: 'Adjustments',
          href: '/adjustments',
        },
        {
          title: 'Categories',
          href: '/adjustment-categories',
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
