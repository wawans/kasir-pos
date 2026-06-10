import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, PencilLine, Eye, ArrowRight } from 'lucide-react'
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
          <DropdownMenuItem asChild>
            <Link
              to={`/sales/$id`}
              params={{
                id: (row.original as App.Data.UserActorData)
                  .id as unknown as string,
              }}
            >
              View
              <DropdownMenuShortcut>
                <Eye size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to={`/sales/$id/edit`}
              params={{
                id: (row.original as App.Data.UserActorData)
                  .id as unknown as string,
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <PencilLine size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              to={`/sales-returns/create/$id`}
              params={{
                id: (row.original as App.Data.UserActorData)
                  .id as unknown as string,
              }}
            >
              Return
              <DropdownMenuShortcut>
                <ArrowRight size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className='text-red-500!'
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
