import { RouterProvider } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-provider'

// @ts-expect-error any
export function Router({ router }) {
  const auth = useAuth()

  return <RouterProvider router={router} context={{ auth }} />
}
