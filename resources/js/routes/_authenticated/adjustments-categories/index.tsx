import { createFileRoute } from '@tanstack/react-router'
import { AdjustmentsCategories } from '@/features/adjustments-categories'

export const Route = createFileRoute('/_authenticated/adjustments-categories/')(
  {
    component: AdjustmentsCategories,
  }
)
