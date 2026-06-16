import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export function CategoryItem({
  category,
  onClick,
  isActive = false,
}: {
  category: App.Data.CategoryData
  isActive?: boolean
  onClick?: (v: string | number) => void
}) {
  return (
    <Card
      onClick={() => {
        if (onClick) onClick(category.id)
      }}
      className={cn(
        'h-full max-h-36 w-full shrink-0 cursor-pointer justify-center self-stretch rounded-md py-3 text-center hover:bg-accent max-lg:min-w-24',
        isActive &&
          'border-destructive text-destructive hover:bg-destructive/10'
      )}
    >
      <CardContent className='px-2'>
        <p className='line-clamp-2 text-sm font-medium tracking-wide'>
          {category.name}
        </p>
      </CardContent>
    </Card>
  )
}
