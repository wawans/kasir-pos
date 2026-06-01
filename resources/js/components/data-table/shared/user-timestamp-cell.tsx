import { format } from 'date-fns'
import type { Row } from '@tanstack/react-table'
import { getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserstampCellProps<TData> = {
  row: Row<TData>
}

export function UserTimestampCell<TData>({
  row: { original },
}: UserstampCellProps<TData>) {
  const user = original?.updatedBy || original?.createdBy
  const initials = getDisplayNameInitials(user?.name || '')
  const timestamp = original?.updated_at || original?.created_at
  const textstamp = timestamp ? format(timestamp, 'dd/MM/yyyy HH:mm:ss') : null

  return (
    <div className='flex w-fit items-center gap-2 overflow-hidden'>
      <Avatar className='size-8 rounded-md'>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback className='rounded-md text-sm'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-start leading-tight'>
        <span className='truncate text-sm font-medium'>{user?.name}</span>
        <span
          className='truncate text-xs text-muted-foreground'
          title={textstamp || ''}
        >
          {textstamp}
        </span>
      </div>
    </div>
  )
}
