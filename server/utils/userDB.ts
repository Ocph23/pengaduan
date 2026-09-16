import bcrypt from 'bcryptjs';
import { getDb, query } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface User {
  id: number
  nomor_induk:string
  name: string
  username:string
  password:string
  role:string
  phone_number:string
}

// Ambil semua kategori
export const getAlluser = async (): Promise<User[]> => {
  const sql = `SELECT * FROM user ORDER BY id ASC`
  return query<User[]>(sql)
}

// Ambil kategori berdasarkan ID
export const getUserById = async (id: number): Promise<User | null> => {
  const sql = `SELECT * FROM user WHERE id = ?`
  const rows = await query<RowDataPacket[]>(sql, [id])
  return (rows[0] as User) || null
}

// Cek apakah nama kategori sudah ada
export const isNameUserExists = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  let sql = `SELECT COUNT(*) as count FROM user WHERE name = ?`
  const params: any[] = [name]

  if (excludeId !== undefined) {
    sql += ` AND id != ?`
    params.push(excludeId)
  }

  const rows = await query<RowDataPacket[]>(sql, params)
  return (rows[0]?.count || 0) > 0
}

// Tambah kategori baru
export const createUser = async (user:User): Promise<User> => {
   const hashedPassword = await bcrypt.hash(user.password, 10);
  const sql = `INSERT INTO user (nomor_induk, name, username, password, role, phone_number)
   VALUES (?,?,?,?,?,?)`
  const result = await query<ResultSetHeader>(sql, [user.nomor_induk, user.name, user.username, hashedPassword, user.role, user.phone_number])
  return (await getUserById(result.insertId))!
}

// Update kategori
export const updateUser = async (user:User): Promise<User | null> => {
  const sql = `UPDATE user SET 
    nomor_induk = ?, 
    name = ?, 
    phone_number = ? 
    WHERE id = ?`
  await query<ResultSetHeader>(sql, [user.nomor_induk, user.name, user.phone_number, user.id])
  return getUserById(user.id)
}

// Hapus kategori
export const deleteUser = async (id: number): Promise<boolean> => {
  const sql = `DELETE FROM user WHERE id = ?`
  const result = await query<ResultSetHeader>(sql, [id])
  return result.affectedRows > 0
}