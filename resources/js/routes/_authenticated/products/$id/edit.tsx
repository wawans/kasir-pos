import { createFileRoute } from '@tanstack/react-router'
import { UpdateProduct } from '@/features/products/update'

export const Route = createFileRoute('/_authenticated/products/$id/edit')({
  component: UpdateProduct,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/products/$id/edit"!</div>
}
