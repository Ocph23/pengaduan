import { createReport } from '../../utils/reportDB'
import { requireUser } from '../../utils/auth'

const cleanString = (value: unknown) => String(value || '').trim()
const cleanOptionalNumber = (value: unknown) => {
  const numberValue = Number(value)
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null
}

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)

  const reporterType = cleanString(user.role).toLowerCase()
  const reporterName = cleanString(user.name)
  const reporterIdentifier = cleanString(user.nomor_induk)
  const phoneNumber = cleanString(user.phone_number)
  const title = cleanString(body.title)
  const description = cleanString(body.description)
  const categoryId = cleanOptionalNumber(body.categoryId)
  const locationId = cleanOptionalNumber(body.locationId)

  if (reporterType !== 'siswa' && reporterType !== 'guru') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Jenis pelapor harus siswa atau guru'
    })
  }

  if (!reporterName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama pelapor wajib diisi'
    })
  }

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Judul laporan wajib diisi'
    })
  }

  if (!description || description.length < 10) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Isi laporan minimal 10 karakter'
    })
  }

  const report = await createReport({
    userId: user.id,
    reporterType,
    reporterName,
    reporterIdentifier: reporterIdentifier || null,
    phoneNumber: phoneNumber || null,
    categoryId,
    locationId,
    title,
    description
  })

  return {
    success: true,
    message: 'Laporan berhasil dikirim',
    data: report
  }
})
