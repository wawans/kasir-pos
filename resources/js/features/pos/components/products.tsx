import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@reactuses/core'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProductsQueryOptions } from '@/features/products/components/utils'
import { Categories } from './categories'
import { ProductItem } from './product-item'

export function Products({
  onClick,
}: {
  onClick?: (v: App.Data.ProductData) => void
}) {
  const [search, setSearch] = useState<string | number | null>(null)
  const [searchCat, setSearchCat] = useState<string | number | null>(null)
  const { data, isLoading } = useQuery(
    ProductsQueryOptions(undefined, {
      filter: {
        ...(searchCat ? { category_id: searchCat } : {}),
        ...(search ? { search } : {}),
      },
    })
  )

  const [value, setValue] = useState<string | number | null>(search)
  const deferredValue = useDebounce(value, 500)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(deferredValue)
  }, [deferredValue])

  const onClickHandler = (val: App.Data.ProductData) => {
    if (onClick) {
      onClick(val)
      if (value) setValue(null)
    }
  }

  return (
    <Card className='gap-4'>
      <CardHeader className='border-b px-4 [.border-b]:pb-4'>
        <Input
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Scan or search product by code or name'
        />
      </CardHeader>
      <CardContent className='px-4'>
        <Categories value={searchCat} onValueChange={setSearchCat} />
      </CardContent>
      <CardContent className='grid grid-cols-2 gap-4 px-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          ((data as App.Data.ProductData[]) || []).map((p) => (
            <ProductItem key={p.id} product={p} onClick={onClickHandler} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
