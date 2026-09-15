import { getDb } from './db';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  const db = getDb();
  try {
    // 1. Buat tabel jika belum ada
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomor_induk VARCHAR(255) NULL,
        name VARCHAR(255) NOT NULL DEFAULT '',
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        phone_number VARCHAR(255) NULL
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      )
    `);


    await db.execute(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT
      )
    `);


    // 2. Cek apakah admin sudah ada
    const [rows]: any = await db.execute('SELECT id FROM user WHERE username = ?', ['admin']);

    // 3. Jika kosong, buat seeder admin
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.execute(
        'INSERT INTO user (nomor_induk, name, username, password, role) VALUES (?, ?, ?,?,?)',
        ["00000001",'Administrator', 'admin', hashedPassword, 'admin']
      );
      console.log('✅ [SEED] Akun admin berhasil dibuat (username: admin, password: admin123)');
    }
  } catch (error) {
    console.error('❌ [SEED] Error saat inisialisasi database:', error);
  }
};
