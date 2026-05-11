import { useMemo, useState } from 'react'
import { Mail, Trash2, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDataTableProvider } from '@/components/data/data-table-provider.tsx'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

export function DataTableBulkActions() {
  const table = useDataTableProvider()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = useMemo(
    () => table.getFilteredSelectedRowModel().rows,
    [table]
  )

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original.id)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} users`,
      finally: () => {
        table.resetRowSelection()
      },
    })
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original.id)
    toast.promise(sleep(2000), {
      loading: 'Inviting users: ' + selectedUsers.join(','),
      success: () => {
        table.resetRowSelection()
        return `Invited ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: 'Error inviting users',
      finally: () => {
        table.resetRowSelection()
      },
    })
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleBulkInvite}
            className='size-8'
            aria-label='Invite selected users'
            title='Invite selected users'
          >
            <Mail />
            <span className='sr-only'>Invite selected users</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Invite selected users</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleBulkStatusChange('active')}
            className='size-8'
            aria-label='Activate selected users'
            title='Activate selected users'
          >
            <UserCheck />
            <span className='sr-only'>Activate selected users</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Activate selected users</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleBulkStatusChange('inactive')}
            className='size-8'
            aria-label='Deactivate selected users'
            title='Deactivate selected users'
          >
            <UserX />
            <span className='sr-only'>Deactivate selected users</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Deactivate selected users</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='destructive'
            size='icon'
            onClick={() => setShowDeleteConfirm(true)}
            className='size-8'
            aria-label='Delete selected users'
            title='Delete selected users'
          >
            <Trash2 />
            <span className='sr-only'>Delete selected users</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete selected users</p>
        </TooltipContent>
      </Tooltip>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
