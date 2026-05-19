'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDataProvider } from '@/components/data/data-provider'
import { DeleteBulkDialog } from './delete-bulk-dialog'

type DeleteBulkActionProps<TData> = {
  table: Table<TData>
}

export function DeleteBulkAction<TData>({
  table,
}: DeleteBulkActionProps<TData>) {
  const { entity } = useDataProvider()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='destructive'
            size='icon'
            onClick={() => setShowDeleteConfirm(true)}
            className='size-8'
            aria-label={`Delete selected ${entity}`}
            title={`Delete selected ${entity}`}
          >
            <Trash2 />
            <span className='sr-only'>Delete selected {entity}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete selected {entity}</p>
        </TooltipContent>
      </Tooltip>

      <DeleteBulkDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
