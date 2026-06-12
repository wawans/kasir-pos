import { useState, useDeferredValue, useEffect } from 'react'
import type { Column } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ColumnFilter({ column }: { column: Column<any, unknown> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>(column.getFilterValue() as any)
  const deferredValue = useDeferredValue(value)

  // @ts-expect-error @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { filterColumn } = column.columnDef.meta ?? {}

  useEffect(() => {
    column.setFilterValue(deferredValue)
  }, [column, deferredValue])

  return (
    <Input
      type='text'
      value={(value ?? '') as string}
      onChange={(event) => setValue(event.target.value)}
      className='h-8'
      placeholder='Search...'
    />
  )
}
