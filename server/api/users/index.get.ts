import { getAlluser } from '../../utils/userDB'

export default defineEventHandler(async () => {
  const users = await getAlluser()

  return {
    success: true,
    data: users,
    total: users.length
  }
})