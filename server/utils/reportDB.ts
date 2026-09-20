import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { query } from './db'

export interface Report {
  id: number
  user_id: number | null
  reporter_type: 'siswa' | 'guru'
  reporter_name: string
  reporter_identifier: string | null
  phone_number: string | null
  category_id: number | null
  location_id: number | null
  title: string
  description: string
  status: string
  created_at: string
  category_name?: string | null
  location_name?: string | null
}

export interface CreateReportInput {
  userId: number
  reporterType: 'siswa' | 'guru'
  reporterName: string
  reporterIdentifier?: string | null
  phoneNumber?: string | null
  categoryId?: number | null
  locationId?: number | null
  title: string
  description: string
}

export const getReportById = async (id: number): Promise<Report | null> => {
  const rows = await query<RowDataPacket[]>('SELECT * FROM reports WHERE id = ?', [id])
  return (rows[0] as Report) || null
}

export const getReports = async (userId?: number): Promise<Report[]> => {
  const params: any[] = []
  let where = ''

  if (userId) {
    where = 'WHERE r.user_id = ?'
    params.push(userId)
  }

  const sql = `
    SELECT
      r.*,
      c.name AS category_name,
      l.name AS location_name
    FROM reports r
    LEFT JOIN categories c ON c.id = r.category_id
    LEFT JOIN locations l ON l.id = r.location_id
    ${where}
    ORDER BY r.created_at DESC, r.id DESC
  `

  return query<Report[]>(sql, params)
}

export const createReport = async (input: CreateReportInput): Promise<Report> => {
  const sql = `
    INSERT INTO reports (
      user_id,
      reporter_type,
      reporter_name,
      reporter_identifier,
      phone_number,
      category_id,
      location_id,
      title,
      description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const result = await query<ResultSetHeader>(sql, [
    input.userId,
    input.reporterType,
    input.reporterName,
    input.reporterIdentifier || null,
    input.phoneNumber || null,
    input.categoryId || null,
    input.locationId || null,
    input.title,
    input.description
  ])

  return (await getReportById(result.insertId))!
}

export const updateReportStatus = async (id: number, status: string): Promise<Report | null> => {
  await query<ResultSetHeader>('UPDATE reports SET status = ? WHERE id = ?', [status, id])
  return getReportById(id)
}
