import { createFileRoute } from '@tanstack/react-router'
import { StocksLogs } from '@/features/stocks-logs'

export const Route = createFileRoute('/_authenticated/stocks-logs/')({
  component: StocksLogs,
})
