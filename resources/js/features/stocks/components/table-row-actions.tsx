import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, PencilLine, Eye, TimerReset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDataProvider } from '@/components/data/data-provider'

type TableRowActionsProps<TData> = {
  row: Row<TData>
}
export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useDataProvider()
  const navigate = useNavigate()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/stocks-logs',
                search: {
                  product: row.original?.product_id,
                },
              })
            }}
          >
            View Logs
            <DropdownMenuShortcut>
              <TimerReset size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
