export const APP_NAME =
  import.meta.env.VITE_APP_NAME || import.meta.env.APP_NAME || 'Laravel'

export const APP_URL =
  import.meta.env.VITE_APP_URL || import.meta.env.APP_URL || 'http://localhost'

export const API_URL =
  import.meta.env.VITE_API_URL || import.meta.env.API_URL || `${APP_URL}/api`
