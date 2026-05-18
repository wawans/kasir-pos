import { useDataProvider } from '@/components/data/data-provider.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Plus } from 'lucide-react'

export function ActionButtons() {
  const { setOpen } = useDataProvider()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Add New</span> <Plus size={18} />
      </Button>
    </div>
  )
}
