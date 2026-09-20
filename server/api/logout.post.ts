import { clearSessionUser } from '../utils/auth'

export default defineEventHandler((event) => {
  clearSessionUser(event)

  return {
    success: true,
    message: 'Logout berhasil'
  }
})
