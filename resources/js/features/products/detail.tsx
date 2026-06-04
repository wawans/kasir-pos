import { Data } from '@/components/data/data'
import { Entity, EntityURL } from '@/features/products/index'

export function DetailProduct() {
  return (
    <Data
      entity={Entity}
      url={EntityURL}
      title='Product'
      description='View your product and their information here.'
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
          title: 'Detail',
          href: '/products',
        },
      ]}
    >
      <h1>Detail</h1>
    </Data>
  )
}
