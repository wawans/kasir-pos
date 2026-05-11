import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_URL || import.meta.env.APP_URL

const instance = axios.create({
  ...(baseURL && { baseURL: baseURL }),
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
  },
})

export interface LaravelValidationError {
  message: string
  errors: {
    [field: string]: string[]
  }
}

export default instance
