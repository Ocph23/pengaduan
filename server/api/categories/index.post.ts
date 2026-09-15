import { createCategory, isNameExists } from '../../utils/categoryDB'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.name || typeof body.name !== 'string' || !body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama kategori wajib diisi'
    })
  }

  const name = body.name.trim()

  const exists = await isNameExists(name)
  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Nama kategori sudah digunakan'
    })
  }

  try {
    const newCategory = await createCategory(name)
    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: newCategory
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menambahkan kategori'
    })
  }
})
