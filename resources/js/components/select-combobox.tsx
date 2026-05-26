import { type ComponentProps } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { type Command as CommandPrimitive } from 'cmdk'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command.tsx'
import { FormControl } from '@/components/ui/form.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

interface DataItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type SelectComboboxProps = {
  isLoading?: boolean
  data: DataItem[]
  search: ComponentProps<typeof CommandPrimitive.Input>['value']
  onSearchChange: ComponentProps<typeof CommandPrimitive.Input>['onValueChange']
  value: ComponentProps<typeof CommandPrimitive.Item>['value']
  onValueChange: ComponentProps<typeof CommandPrimitive.Item>['onSelect']
  valueBy?: string
  labelBy?: string
  manualFiltering?: boolean
}
export function SelectCombobox({
  data = [],
  search,
  onSearchChange,
  value,
  onValueChange,
  valueBy = 'value',
  labelBy = 'label',
  isLoading = false,
  manualFiltering = false,
}: SelectComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn(
              'w-auto justify-between',
              !value && 'text-muted-foreground'
            )}
          >
            {value
              ? data.find((f) => f[valueBy] === value)?.[labelBy]
              : 'Select...'}
            <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Command shouldFilter={!manualFiltering}>
          <CommandInput
            value={search}
            onValueChange={onSearchChange}
            placeholder='Search...'
          />
          {!isLoading && <CommandEmpty>No data found.</CommandEmpty>}
          <CommandGroup>
            <CommandList>
              {isLoading && (
                <CommandLoading className='h-14'>
                  <div className='flex items-center justify-center gap-2'>
                    <Spinner className='size-5' />
                    <span>Loading...</span>
                  </div>
                </CommandLoading>
              )}
              {data.map((f) => (
                <CommandItem
                  value={f[labelBy]}
                  key={f[valueBy]}
                  onSelect={() => {
                    onValueChange?.(f[valueBy])
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'size-4',
                      f[valueBy] === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {f[labelBy]}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
