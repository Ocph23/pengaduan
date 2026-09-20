import { requireUser } from '../../utils/auth'
import { getReports } from '../../utils/reportDB'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const reports = await getReports(user.role === 'admin' ? undefined : user.id)

  return {
    success: true,
    data: reports,
    total: reports.length
  }
})
