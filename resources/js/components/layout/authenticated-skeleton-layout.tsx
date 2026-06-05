import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider, useLayout } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { Avatar } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import type {
  NavCollapsible,
  NavGroup as NavGroupProps,
  NavLink,
} from '@/components/layout/types'
import { SkipToMain } from '@/components/skip-to-main'

export function AuthenticatedSkeletonLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}

function AppSidebar() {
  const { collapsible, variant } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function AppTitle() {
  const { state } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <div>
            <div className='flex flex-1 flex-row items-center gap-2'>
              <div className={cn(state === 'collapsed' ? 'size-8' : 'size-10')}>
                <Skeleton className='h-full w-full flex-1' />
              </div>
              <div className='grid flex-1'>
                <Skeleton
                  className={cn(
                    state === 'collapsed' ? 'h-8' : 'h-10',
                    'flex-1'
                  )}
                />
              </div>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavGroup({ items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Skeleton className='h-3 w-1/3' />
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return (state === 'collapsed')
              ? <SidebarMenuIcon key={key} />
              : <SidebarMenuLink key={key} item={item} />

          if (state === 'collapsed' && !isMobile)
            /*return <SidebarMenuCollapsedDropdown key={key} item={item} />*/
            return <SidebarMenuIcon key={key} />

          if (state === 'collapsed')
            return <SidebarMenuIcon key={key} />

          return <SidebarMenuCollapsible key={key} item={item} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavUser() {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <Skeleton className='size-8 flex-1' />
            </Avatar>
            <div className='grid flex-1 gap-1 text-start text-sm leading-tight'>
              <Skeleton className='h-4 flex-1' />
              <Skeleton className='h-3 flex-1' />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}

function SidebarMenuIcon() {
  return (
    <div className='flex items-center justify-center'>
      <Skeleton className='size-8' />
    </div>
  )
}

function SidebarMenuLink({ item }: { item: NavLink }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div>
          {item.icon && <Skeleton className='h-6 w-6' />}
          <Skeleton className='h-6 flex-1' />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({ item }: { item: NavCollapsible }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div>
          {item.icon && <Skeleton className='h-6 w-6' />}
          <Skeleton className='h-6 flex-1' />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// @ts-expect-error @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SidebarMenuCollapsedDropdown({ item }: { item: NavCollapsible }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div>
          {item.icon && <Skeleton className='h-6 w-6' />}
          <Skeleton className='h-6 flex-1' />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
