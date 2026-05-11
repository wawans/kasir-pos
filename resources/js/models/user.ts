import type { Model } from './model'

export interface User extends Model {
  id: number
  name: string
  email: string
  avatar?: string
  email_verified_at: string | null
  two_factor_enabled?: boolean
  created_at: string
  updated_at: string
  [key: string]: unknown
}
