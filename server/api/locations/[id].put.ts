import { updateLocation, getLocationById, isNameLocationExists } from '../../utils/locationDB'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID kategori tidak valid'
    })
  }

  const existingCategory = await getLocationById(id)
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
  const description = body.description.trim()

  const duplicate = await isNameLocationExists(name, id)
  if (duplicate) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Nama kategori sudah digunakan'
    })
  }

  try {
    const updated = await updateLocation(id, name, description)
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
