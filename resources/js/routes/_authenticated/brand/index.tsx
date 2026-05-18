import { createFileRoute } from '@tanstack/react-router'
import { Brand } from '@/features/brand/index'

export const Route = createFileRoute('/_authenticated/brand/')({
  component: Brand,
})

