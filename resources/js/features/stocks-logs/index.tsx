import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table'
import { columns } from './components/table-columns'

export function StocksLogs() {
  return (
    <Data
      entity='Stock Logs'
      url='stock-log'
      title='Stock Logs'
      description='View your Stock Logs and their information here.'
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
          title: 'Stock Logs',
          href: '/stocks-logs',
        },
      ]}
    >
      <DataTable columns={columns} searchKey='name' include='product,unit' />
    </Data>
  )
}
