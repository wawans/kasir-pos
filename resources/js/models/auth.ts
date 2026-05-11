import type { User } from './user'

export type Auth = {
  user: User
}

export type TwoFactorSetupData = {
  svg: string
  url: string
}

export type TwoFactorSecretKey = {
  secretKey: string
}
