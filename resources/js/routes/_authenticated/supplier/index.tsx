import { createFileRoute } from '@tanstack/react-router'
import { Supplier } from '@/features/supplier'

export const Route = createFileRoute('/_authenticated/supplier/')({
  component: Supplier,
})
