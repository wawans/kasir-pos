import { type ComponentProps } from 'react'
import type * as SelectPrimitive from '@radix-ui/react-select'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectDropdownProps extends ComponentProps<
  typeof SelectPrimitive.Root
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange?: (value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  placeholder?: string
  isPending?: boolean
  items?: {
    // label: string; value: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }[]
  disabled?: boolean
  className?: string
  valueBy?: string
  labelBy?: string
}

export function SelectDropdown({
  isPending,
  items,
  placeholder,
  disabled,
  className = '',
  valueBy = 'value',
  labelBy = 'label',
  ...props
}: SelectDropdownProps) {
  return (
    <Select {...props}>
      <FormControl>
        <SelectTrigger disabled={disabled} className={cn(className)}>
          <SelectValue placeholder={placeholder ?? 'Select'} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {isPending ? (
          <SelectItem disabled value='loading' className='h-14'>
            <div className='flex items-center justify-center gap-2'>
              <Loader className='h-5 w-5 animate-spin' />
              {'  '}
              Loading...
            </div>
          </SelectItem>
        ) : (
          items?.map((f) => (
            <SelectItem key={f[labelBy] + f[valueBy]} value={f[valueBy]}>
              {f[labelBy]}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
