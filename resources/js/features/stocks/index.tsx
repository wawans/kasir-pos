import { Data } from '@/components/data/data'
import { DataTable } from '@/components/data/data-table.tsx'
import { columns } from './components/table-columns'

export function Stocks() {
  return (
    <Data
      entity='Stock'
      url='stock'
      title='Stock'
      description='View your stocks and their information here.'
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/',
        },
        {
          title: 'Stocks',
          href: '/stocks',
        },
      ]}
    >
      <DataTable columns={columns} searchKey='name' include='product,unit' />
    </Data>
  )
}
