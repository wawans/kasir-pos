import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ActionButtons() {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' asChild>
        <Link to='/purchases/create'>
          <span>Add New</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
