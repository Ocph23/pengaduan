import { seedDatabase } from '../utils/seed';

export default defineNitroPlugin(() => {
  // Jalankan saat server siap
  seedDatabase();
});
