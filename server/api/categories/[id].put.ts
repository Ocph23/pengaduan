import { updateCategory, getCategoryById, isNameExists } from '../../utils/categoryDB'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID kategori tidak valid'
    })
  }

  const existingCategory = await getCategoryById(id)
  if (!existingCategory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Kategori tidak ditemukan'
    })
  }

  const body = await readBody(event)
  if (!body || !body.name || typeof body.name !== 'string' || !body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama kategori wajib diisi'
    })
  }

  const name = body.name.trim()

  const duplicate = await isNameExists(name, id)
  if (duplicate) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Nama kategori sudah digunakan'
    })
  }

  try {
    const updated = await updateCategory(id, name)
    return {
      success: true,
      message: 'Kategori berhasil diperbarui',
      data: updated
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal memperbarui kategori'
    })
  }
})
