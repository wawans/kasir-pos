import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  KeyRound,
  LayoutDashboard,
  Package,
  Ribbon,
  RulerDimensionLine,
  Settings,
  Truck,
  User,
  UserCog,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },

        {
          title: 'Products',
          icon: Package,
          items: [
            {
              title: 'Brand',
              url: '/brand',
              icon: Ribbon,
            },
            {
              title: 'Unit',
              url: '/unit',
              icon: RulerDimensionLine,
            },
          ],
        },
        {
          title: 'Customer',
          url: '/customer',
          icon: User,
        },
        {
          title: 'Supplier',
          url: '/supplier',
          icon: Truck,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings/account',
              icon: UserCog,
            },
            {
              title: 'Password',
              url: '/settings/password',
              icon: KeyRound,
            },
          ],
        },
      ],
    },
  ],
}
