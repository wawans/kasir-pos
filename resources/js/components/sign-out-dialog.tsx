import { useState } from 'react'
import { useNavigate, useLocation, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-provider'
import { Spinner } from '@/components/ui/spinner'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const router = useRouter()
  const { logout } = useAuth()

  const handleSignOut = () => {
    setIsLoading(true)

    logout()
      .then(() => {
        router.invalidate()

        // Preserve current location for redirect after sign-in
        const currentPath = location.href
        navigate({
          to: '/sign-in',
          search: { redirect: currentPath },
          replace: true,
        })
      })
      .catch(() => {
        toast.error('Error!', { description: 'Something went wrong' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      isLoading={isLoading}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText={isLoading ? <Spinner /> : 'Sign out'}
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
