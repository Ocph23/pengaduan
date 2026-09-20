import mysql from 'mysql2/promise';
import { useRuntimeConfig } from '#imports';

let pool: mysql.Pool;

export const getDb = () => {
  if (!pool) {
    const config = useRuntimeConfig();
    console.log('Connecting to database:', config.dbHost, config.dbUser, config.dbName);
    pool = mysql.createPool({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
};



// Helper untuk query
export const query = async <T = any>(
  sql: string,
  params?: any[]
): Promise<T> => {
  const [rows] = await getDb().execute(sql, params)
  return rows as T
}

// Tutup pool saat server dimatikan
export const closePool = async () => {
  if (pool) {
    await pool.end()
  }
}
