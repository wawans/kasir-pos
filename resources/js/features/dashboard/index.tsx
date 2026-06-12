import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { Page } from '@/components/layout/page'

export function Dashboard() {
  return (
    <Page breadcrumbs={[{ title: 'Dashboard', href: '/' }]}>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
      </Main>
    </Page>
  )
}
