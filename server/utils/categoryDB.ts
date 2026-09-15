import { getDb, query } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface Category {
  id: number
  name: string,
}

// Ambil semua kategori
export const getAllCategories = async (): Promise<Category[]> => {
  const sql = `SELECT id, name FROM categories ORDER BY id ASC`
  return query<Category[]>(sql)
}

// Ambil kategori berdasarkan ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  const sql = `SELECT id, name FROM categories WHERE id = ?`
  const rows = await query<RowDataPacket[]>(sql, [id])
  return (rows[0] as Category) || null
}

// Cek apakah nama kategori sudah ada
export const isNameExists = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  let sql = `SELECT COUNT(*) as count FROM categories WHERE name = ?`
  const params: any[] = [name]

  if (excludeId !== undefined) {
    sql += ` AND id != ?`
    params.push(excludeId)
  }

  const rows = await query<RowDataPacket[]>(sql, params)
  return (rows[0]?.count || 0) > 0
}

// Tambah kategori baru
export const createCategory = async (name: string): Promise<Category> => {
  const sql = `INSERT INTO categories (name) VALUES (?)`
  const result = await query<ResultSetHeader>(sql, [name])
  return (await getCategoryById(result.insertId))!
}

// Update kategori
export const updateCategory = async (
  id: number,
  name: string
): Promise<Category | null> => {
  const sql = `UPDATE categories SET name = ? WHERE id = ?`
  await query<ResultSetHeader>(sql, [name, id])
  return getCategoryById(id)
}

// Hapus kategori
export const deleteCategory = async (id: number): Promise<boolean> => {
  const sql = `DELETE FROM categories WHERE id = ?`
  const result = await query<ResultSetHeader>(sql, [id])
  return result.affectedRows > 0
}