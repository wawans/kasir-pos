import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  KeyRound,
  LayoutDashboard,
  Package,
  Blocks,
  RulerDimensionLine,
  Truck,
  ArrowUpDown,
  UserCog,
  Users,
  Printer,
  Award,
  ReceiptText,
  ArrowLeft,
  ArrowRight,
  Signpost,
  Hand,
  ShoppingCart,
  ChartNoAxesCombined,
  Store,
  CreditCard,
  SwatchBook,
  Boxes,
  Keyboard,
  Milestone,
  TimerReset,
  ClockFading,
  Settings,
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
          title: 'POS',
          url: '/pos',
          icon: Keyboard,
        },
        {
          title: 'Products',
          icon: Package,
          items: [
            {
              title: 'Products',
              url: '/products',
              icon: Boxes,
            },
            {
              title: 'Categories',
              url: '/products-categories',
              icon: SwatchBook,
            },
            {
              title: 'Brands',
              url: '/brands',
              icon: Award,
            },
            {
              title: 'Units',
              url: '/units',
              icon: RulerDimensionLine,
            },
            {
              title: 'Print Barcode',
              url: '/products-barcodes',
              icon: Printer,
            },
          ],
        },
        {
          title: 'Stocks',
          icon: Blocks,
          items: [
            {
              title: 'Stocks',
              url: '/stocks',
              icon: ArrowUpDown,
            },
            {
              title: 'Adjustments',
              url: '/adjustments',
              icon: Signpost,
            },
            {
              title: 'Adjustments Categories',
              url: '/adjustments-categories',
              icon: Milestone,
            },
            {
              title: 'Stocks Logs',
              url: '/stocks-logs',
              icon: TimerReset,
            },
          ],
        },
        {
          title: 'Purchases',
          icon: ReceiptText,
          items: [
            {
              title: 'Purchases',
              url: '/purchases',
              icon: ReceiptText,
            },
            {
              title: 'Purchases Returns',
              url: '/purchases-returns',
              icon: ArrowLeft,
            },
          ],
        },
        {
          title: 'Sales',
          icon: ShoppingCart,
          items: [
            {
              title: 'Sales',
              url: '/sales',
              icon: ShoppingCart,
            },
            {
              title: 'Sales Returns',
              url: '/sales-returns',
              icon: ArrowRight,
            },
            {
              title: 'Holds',
              url: '/sales-holds',
              icon: Hand,
            },
            {
              title: 'POS',
              url: '/sales-pos',
              icon: ClockFading,
            },
          ],
        },
        {
          title: 'Customers',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'Suppliers',
          url: '/suppliers',
          icon: Truck,
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: ChartNoAxesCombined,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Umum',
          icon: Settings,
          items: [
            {
              title: 'Stores',
              url: '/stores',
              icon: Store,
            },
            {
              title: 'Payment Methods',
              url: '/payment-methods',
              icon: CreditCard,
            },
          ],
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'My Account',
          icon: UserCog,
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
