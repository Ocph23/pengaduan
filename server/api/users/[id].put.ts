import { updateUser, getUserById, isNameUserExists, User } from '../../utils/userDB'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID User tidak valid'
    })
  }

  const existingUSer = await getUserById(id)
  if (!existingUSer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  const body = await readBody(event)
  if (!body || !body.name || typeof body.name !== 'string' || !body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama User wajib diisi'
    })
  }

  const user = {
    id:id,
    nomor_induk: body.nomor_induk,
    name : body.name,
    phone_number : body.phone_number,
  } as User

  const duplicate = await isNameUserExists(user.name, id)
  if (duplicate) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Nama User sudah digunakan'
    })
  }

  try {
    const updated = await updateUser(user)
    return {
      success: true,
      message: 'User berhasil diperbarui',
      data: updated
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal memperbarui User'
    })
  }
})
