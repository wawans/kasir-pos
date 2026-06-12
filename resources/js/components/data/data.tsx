import {
  DataProvider,
  type DataProviderProps,
} from '@/components/data/data-provider'
import { Main } from '@/components/layout/main'
import { Page, type PageProps } from '@/components/layout/page'

type DataProps = PageProps &
  DataProviderProps & {
    title: string
    description?: string
    actions?: React.ReactElement
  }
export function Data({
  entity,
  url,
  title,
  description,
  actions,
  breadcrumbs,
  links,
  children,
}: DataProps) {
  return (
    <DataProvider entity={entity} url={url}>
      <Page breadcrumbs={breadcrumbs} links={links}>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fluid>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              <p className='text-muted-foreground'>{description}</p>
            </div>
            {actions}
          </div>
          {children}
        </Main>
      </Page>
    </DataProvider>
  )
}
