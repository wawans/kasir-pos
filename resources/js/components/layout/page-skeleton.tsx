import { Outlet } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'

export function PageSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header fixed>
        <div className='flex shrink-0 items-center'></div>
        <div className='ms-auto flex items-center space-x-5'>
          <div>
            <Skeleton className='h-8 w-full sm:w-40 lg:w-52 xl:w-64' />
          </div>
          <div className='relative h-8 w-8'>
            <Skeleton className='h-8 w-8' />
          </div>
          <div className='relative h-8 w-8'>
            <Skeleton className='h-8 w-8' />
          </div>
          <div className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback>
                <Skeleton className='h-8 w-8' />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Header>

      {children ?? <Outlet />}
    </>
  )
}
