import { deleteUser, getUserById } from '../../utils/userDB'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID User tidak valid'
    })
  }

  const existingUser = await getUserById(id)
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  try {
    const deleted = await deleteUser(id)
    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal menghapus User'
      })
    }

    return {
      success: true,
      message: 'User berhasil dihapus'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal menghapus User'
    })
  }
})
