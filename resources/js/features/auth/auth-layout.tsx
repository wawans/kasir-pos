import { APP_NAME } from '@/config/app'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2 size-10 -scale-x-100 rotate-180' />
          <h1 className='font-instrument-sans text-xl font-bold'>{APP_NAME}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
