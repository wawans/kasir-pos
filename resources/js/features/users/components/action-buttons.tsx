import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDataProvider } from '@/components/data/data-provider'

export function ActionButtons() {
  const { setOpen } = useDataProvider()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
