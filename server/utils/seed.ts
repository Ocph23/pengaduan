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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        reporter_type ENUM('siswa', 'guru') NOT NULL,
        reporter_name VARCHAR(255) NOT NULL,
        reporter_identifier VARCHAR(100) NULL,
        phone_number VARCHAR(50) NULL,
        category_id INT NULL,
        location_id INT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'baru',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
      )
    `);

    const [reportColumns]: any = await db.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'reports'
        AND COLUMN_NAME = 'user_id'
    `);

    if (reportColumns.length === 0) {
      await db.execute(`ALTER TABLE reports ADD COLUMN user_id INT NULL AFTER id`);
      await db.execute(`ALTER TABLE reports ADD CONSTRAINT reports_user_id_fk FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL`);
    }


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
