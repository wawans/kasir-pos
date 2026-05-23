import { createFileRoute } from '@tanstack/react-router'
import { SalesPos } from '@/features/sales-pos'

export const Route = createFileRoute('/_authenticated/sales-pos/')({
  component: SalesPos,
})
