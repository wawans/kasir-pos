import { createFileRoute } from '@tanstack/react-router'
import { DetailProduct } from '@/features/products/detail'

export const Route = createFileRoute('/_authenticated/products/$id/')({
  component: DetailProduct,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/products/$id/"!</div>
}
