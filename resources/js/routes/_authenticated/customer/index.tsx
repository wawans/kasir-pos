import { createFileRoute } from '@tanstack/react-router'
import { Customer } from '@/features/customer'

export const Route = createFileRoute('/_authenticated/customer/')({
  component: Customer,
})
