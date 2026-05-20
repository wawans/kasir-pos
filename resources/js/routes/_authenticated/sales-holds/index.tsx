import { createFileRoute } from '@tanstack/react-router'
import { SalesHolds } from '@/features/sales-holds'

export const Route = createFileRoute('/_authenticated/sales-holds/')({
  component: SalesHolds,
})
