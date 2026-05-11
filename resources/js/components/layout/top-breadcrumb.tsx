import { Fragment } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

export type TopBreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  breadcrumbs: {
    title: string
    href?: string
    disabled?: boolean
  }[]
}

export function TopBreadcrumb({
  className,
  breadcrumbs,
  ...props
}: TopBreadcrumbProps) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className={cn('sm:size-7 md:hidden', className)}
          >
            <Menu />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start'>
          {breadcrumbs.map(({ title, href, disabled }, index) => (
            <DropdownMenuItem key={`${title}-${href}-${index}`} asChild>
              <Link
                to={href}
                className={
                  index != breadcrumbs.length - 1 ? 'text-muted-foreground' : ''
                }
                disabled={disabled || index == breadcrumbs.length - 1}
              >
                {title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Breadcrumb
        className={cn(
          'hidden items-center space-x-4 md:flex md:space-x-4 xl:space-x-6',
          className
        )}
        {...props}
      >
        <BreadcrumbList>
          {breadcrumbs.map(({ title, href, disabled }, index) => {
            const last = index == breadcrumbs.length - 1
            if (last || disabled) {
              return (
                <Fragment key={`${title}-${href}-${index}`}>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {!last && breadcrumbs.length > 1 && <BreadcrumbSeparator />}
                </Fragment>
              )
            }

            return (
              <Fragment key={`${title}-${href}-${index}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${last ? '' : 'text-muted-foreground'}`}
                      disabled={last || disabled}
                    >
                      {title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!last && breadcrumbs.length > 1 && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
