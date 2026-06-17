import type { Dispatch, SetStateAction } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel'
import { ProductsCategoriesQueryOptions } from '@/features/products-categories/components/utils'
import { CategoryItem } from './category-item'

export function Categories<T>({
  value,
  onValueChange,
}: {
  value?: T
  onValueChange?: Dispatch<SetStateAction<T>>
}) {
  const { data, isLoading } = useQuery(ProductsCategoriesQueryOptions())

  const onClick = (val: string | number) => {
    if (onValueChange)
      onValueChange(val === value ? (undefined as T) : (val as T))
  }

  return (
    <Carousel className='flex justify-between gap-x-1'>
      {/*<div className='flex min-w-0 items-center justify-between pb-3'>
        <div className='flex'>Categories</div>
        <div className='flex'>
          <Prev />
          <Next />
        </div>
      </div>*/}
      <div className='relative flex w-9 flex-none items-center justify-center'>
        <Prev />
      </div>
      <CarouselContent className='flex flex-nowrap' wrapperClassName='grow-1'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          ((data as App.Data.CategoryData[]) || []).map((p) => (
            <CarouselItem key={p.id} className='mx-1 basis-24'>
              <CategoryItem
                category={p}
                onClick={onClick}
                isActive={value === p.id && value !== undefined}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <div className='relative flex w-9 flex-none items-center justify-center'>
        <Next />
      </div>
    </Carousel>
  )
}

function Next() {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      variant='ghost'
      size='icon'
      disabled={!canScrollNext}
      onClick={scrollNext}
    >
      <ChevronRight />
    </Button>
  )
}

function Prev() {
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      variant='ghost'
      size='icon'
      disabled={!canScrollPrev}
      onClick={scrollPrev}
    >
      <ChevronLeft />
    </Button>
  )
}
