import { format as f } from 'date-fns'

interface DateTextProps extends React.ComponentProps<'span'> {
  format?: string
  value?: string
  asDate?: boolean
}
export function DateText({
  value,
  format = 'dd/MM/yyyy HH:mm:ss',
  asDate = false,
  className,
  children,
}: DateTextProps) {
  const t = value ? f(value, asDate ? 'dd/MM/yyyy' : format) : null
  return (
    <span className={className} title={t || ''}>
      {t ?? children}
    </span>
  )
}
