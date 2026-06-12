import React from 'react'
import { type NumericFormatProps, NumericFormat } from 'react-number-format'
import { cn } from '@/lib/utils'

export interface NumberInputProps extends Omit<
  NumericFormatProps,
  'customInput' | 'displayType'
> {
  asText?: boolean
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, asText = false, ...props }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        data-slot='input'
        className={cn(
          !asText &&
            'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          !asText &&
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          !asText &&
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          className
        )}
        {...(asText ? { displayType: 'text' } : {})}
        {...props}
      />
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }
