import {
  DataProvider,
  type DataProviderProps,
} from '@/components/data/data-provider'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { FormDialog } from './components/form-dialog'

export function Pos() {
  return (
    <DataProvider entity='Pos' url='pos'>
      <Header fixed>
        <div className='flex shrink-0 items-center'></div>
        <div className='ms-auto flex items-center space-x-4'></div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6' fluid>
        <FormDialog />
      </Main>
    </DataProvider>
  )
}
