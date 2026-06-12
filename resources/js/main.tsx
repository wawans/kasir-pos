import React from 'react'
import { AuthProvider } from '@/context/auth-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Main({ children }: { children?: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <AuthProvider>{children}</AuthProvider>
    </TooltipProvider>
  )
}
