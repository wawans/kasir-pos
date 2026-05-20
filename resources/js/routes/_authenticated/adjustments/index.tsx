import { createFileRoute } from '@tanstack/react-router'
import { Adjustments } from '@/features/adjustments'

export const Route = createFileRoute('/_authenticated/adjustments/')({
  component: Adjustments,
})
