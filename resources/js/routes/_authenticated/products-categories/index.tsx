import { createFileRoute } from '@tanstack/react-router'
import { ProductsCategories } from '@/features/products-categories'

export const Route = createFileRoute('/_authenticated/products-categories/')({
  component: ProductsCategories,
})
