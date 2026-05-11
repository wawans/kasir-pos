import { Outlet } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TopBreadcrumb, type TopBreadcrumbProps } from './top-breadcrumb'
import { TopNav, type TopNavProps } from './top-nav'

export type PageProps = {
  breadcrumbs?: TopBreadcrumbProps['breadcrumbs']
  links?: TopNavProps['links']
  children?: React.ReactNode
}

export function Page({ breadcrumbs, links, children }: PageProps) {
  return (
    <>
      <Header fixed>
        <div className='flex shrink-0 items-center'>
          {breadcrumbs && <TopBreadcrumb breadcrumbs={breadcrumbs} />}
          {links && <TopNav links={links} />}
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {children ?? <Outlet />}
    </>
  )
}
