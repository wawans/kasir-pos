import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  // @ts-expect-error @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      try {
        const user = await context.auth.getUser()

        if (!user) {
          throw redirect({
            to: '/sign-in',
            // search: {
            //   ...(location.href.includes('login')
            //     ? {}
            //     : { redirect: location.href }),
            // },
          })
        }
      } catch (error) {
        if (isRedirect(error)) {
          throw error
        }

        throw redirect({
          to: '/sign-in',
          // search: {
          //   ...(location.href.includes('login')
          //     ? {}
          //     : { redirect: location.href }),
          // },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})
