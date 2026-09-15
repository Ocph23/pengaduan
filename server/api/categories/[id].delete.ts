import { deleteCategory, getCategoryById } from '../../utils/categoryDB'

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

  try {
    const deleted = await deleteCategory(id)
    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal menghapus kategori'
      })
    }

    return {
      success: true,
      message: 'Kategori berhasil dihapus'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Gagal menghapus kategori'
    })
  }
})
