import { getAlllocations } from '../../utils/locationDB'

export default defineEventHandler(async () => {
  const categories = await getAlllocations()

  return {
    success: true,
    data: categories,
    total: categories.length
  }
})