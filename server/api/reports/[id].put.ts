import { requireAdmin } from '../../utils/auth'
import { updateReportStatus } from '../../utils/reportDB'

const allowedStatuses = ['baru', 'diproses', 'selesai', 'ditolak']

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const status = String(body?.status || '').trim().toLowerCase()

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID laporan tidak valid'
    })
  }

  if (!allowedStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Status laporan tidak valid'
    })
  }

  const report = await updateReportStatus(id, status)

  if (!report) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Laporan tidak ditemukan'
    })
  }

  return {
    success: true,
    message: 'Status laporan berhasil diperbarui',
    data: report
  }
})
