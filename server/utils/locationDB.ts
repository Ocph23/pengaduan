import { getDb, query } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface Location {
  id: number
  name: string,
  description:string
}

// Ambil semua lokasi
export const getAlllocations = async (): Promise<Location[]> => {
  const sql = `SELECT id, name, description FROM locations ORDER BY id ASC`
  return query<Location[]>(sql)
}

// Ambil lokasi berdasarkan ID
export const getLocationById = async (id: number): Promise<Location | null> => {
  const sql = `SELECT id, name, description FROM locations WHERE id = ?`
  const rows = await query<RowDataPacket[]>(sql, [id])
  return (rows[0] as Location) || null
}

// Cek apakah nama lokasi sudah ada
export const isNameLocationExists = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  let sql = `SELECT COUNT(*) as count FROM locations WHERE name = ?`
  const params: any[] = [name]

  if (excludeId !== undefined) {
    sql += ` AND id != ?`
    params.push(excludeId)
  }

  const rows = await query<RowDataPacket[]>(sql, params)
  return (rows[0]?.count || 0) > 0
}

// Tambah lokasi baru
export const createLocation = async (name: string, description:string): Promise<Location> => {
  const sql = `INSERT INTO locations (name, description) VALUES (?,?)`
  const result = await query<ResultSetHeader>(sql, [name, description])
  return (await getLocationById(result.insertId))!
}

// Update lokasi
export const updateLocation = async (
  id: number,
  name: string,
  description:string
): Promise<Location | null> => {
  const sql = `UPDATE locations SET name = ?, description=? WHERE id = ?`
  await query<ResultSetHeader>(sql, [name, description, id])
  return getLocationById(id)
}

// Hapus lokasi
export const deleteLocation = async (id: number): Promise<boolean> => {
  const sql = `DELETE FROM locations WHERE id = ?`
  const result = await query<ResultSetHeader>(sql, [id])
  return result.affectedRows > 0
}