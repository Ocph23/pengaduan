import { createUser, isNameUserExists } from '../../utils/userDB'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.name || typeof body.name !== 'string' || !body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama User wajib diisi'
    })
  }

  const user = {
    nomor_induk: body.nomor_induk,
    name : body.name,
    username : body.username,
    phone_number : body.phone_number,
    role: body.role,
    password :body.password,
  } as User


  const exists = await isNameUserExists(user.name )
  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Nama User sudah digunakan'
    })
  }

 

  try {
    const newUser = await createUser(user)
    return {
      success: true,
      message: 'User berhasil ditambahkan',
      data: newUser
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menambahkan User'
    })
  }
})
