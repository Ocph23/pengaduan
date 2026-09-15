import { getAllCategories } from '../../utils/categoryDB'

export default defineEventHandler(async () => {
  const categories = await getAllCategories()

  return {
    success: true,
    data: categories,
    total: categories.length
  }
})