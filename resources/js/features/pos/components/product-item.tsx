import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { NumberInput } from '@/components/form/number-input'

export function ProductItem({
  product,
  onClick,
}: {
  product: App.Data.ProductData
  onClick?: (v: App.Data.ProductData) => void
}) {
  return (
    <Card
      onClick={() => {
        if (onClick) onClick(product)
      }}
      className='group cursor-pointer rounded-md py-2 hover:bg-accent'
    >
      <CardHeader className='px-3'></CardHeader>
      <CardContent className='px-3'>
        <p className='truncate text-sm font-medium'>{product.name}</p>
        <p className='truncate text-xs text-muted-foreground'>{product.code}</p>
        <div className='mt-1 flex items-center justify-between'>
          <p className='text-sm'>
            <NumberInput
              className=''
              value={product.stock?.quantity || 0}
              thousandSeparator
              asText
            />
            {` `}
            <span>{product.stock?.unit?.alias}</span>
          </p>
          <p className='text-end text-sm font-medium'>
            <NumberInput
              className='text-end'
              value={product.product_price}
              thousandSeparator
              asText
            />
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
