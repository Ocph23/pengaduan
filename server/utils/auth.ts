import type { H3Event } from 'h3'

export interface SessionUser {
  id: number
  name: string
  username: string
  role: 'admin' | 'siswa' | 'guru' | string
  nomor_induk?: string | null
  phone_number?: string | null
}

const COOKIE_NAME = 'pengaduan_user'

export const setSessionUser = (event: H3Event, user: SessionUser) => {
  setCookie(event, COOKIE_NAME, Buffer.from(JSON.stringify(user)).toString('base64url'), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  })
}

export const clearSessionUser = (event: H3Event) => {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export const getSessionUser = (event: H3Event): SessionUser | null => {
  const value = getCookie(event, COOKIE_NAME)
  if (!value) return null

  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

export const requireUser = (event: H3Event): SessionUser => {
  const user = getSessionUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Silakan login terlebih dahulu'
    })
  }
  return user
}

export const requireAdmin = (event: H3Event): SessionUser => {
  const user = requireUser(event)
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses hanya untuk admin'
    })
  }
  return user
}
