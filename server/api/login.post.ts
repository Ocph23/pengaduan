import { getDb } from '.././utils/db';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi' });
  }

  const db = getDb();
  const [rows]: any = await db.execute('SELECT * FROM user WHERE username = ?', [username]);

  if (rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' });
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' });
  }

  // Catatan: Untuk produksi, ganti ini dengan pembuatan JWT Token atau Session (misal: nuxt-auth)
  
  const userx = {
    id: user.id,
    username: user.username,
    role: user.role
  }
  
  
  return {
    message: 'Login berhasil',
    user:userx
  };
});
