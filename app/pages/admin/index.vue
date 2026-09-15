<template>
  <div>
    <!-- Statistik Cards -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.color }">
          {{ stat.icon }}
        </div>
        <div class="stat-info">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend > 0 ? 'up' : 'down'">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% dari bulan lalu
          </div>
        </div>
      </div>
    </div>

    <!-- Konten Utama -->
    <div class="content-grid">
      <div class="card">
        <div class="card-header">
          <h2>Aktivitas Terbaru</h2>
          <button class="btn-link">Lihat Semua</button>
        </div>
        <div class="activity-list">
          <div v-for="(act, i) in activities" :key="i" class="activity-item">
            <div class="activity-icon">{{ act.icon }}</div>
            <div class="activity-content">
              <div class="activity-text">{{ act.text }}</div>
              <div class="activity-time">{{ act.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Pesanan Terbaru</h2>
          <button class="btn-link">Lihat Semua</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.total }}</td>
              <td>
                <span class="badge" :class="order.status">
                  {{ order.statusLabel }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard Admin'
})

const stats = [
  { label: 'Total User', value: '1.248', icon: '👥', color: '#dbeafe', trend: 12 },
  { label: 'Pendapatan', value: 'Rp 45,2 jt', icon: '💰', color: '#dcfce7', trend: 8 },
  { label: 'Pesanan', value: '324', icon: '🛒', color: '#fef3c7', trend: -3 },
  { label: 'Produk', value: '89', icon: '📦', color: '#fce7f3', trend: 5 }
]

const activities = [
  { icon: '👤', text: 'User baru "Budi Santoso" mendaftar', time: '5 menit lalu' },
  { icon: '🛒', text: 'Pesanan #1024 telah dibayar', time: '15 menit lalu' },
  { icon: '📦', text: 'Produk "Kemeja Biru" stok habis', time: '1 jam lalu' },
  { icon: '💬', text: 'Review baru dari "Siti Aminah"', time: '2 jam lalu' }
]

const orders = [
  { id: 1024, customer: 'Budi Santoso', total: 'Rp 250.000', status: 'success', statusLabel: 'Selesai' },
  { id: 1023, customer: 'Siti Aminah', total: 'Rp 180.000', status: 'pending', statusLabel: 'Pending' },
  { id: 1022, customer: 'Andi Wijaya', total: 'Rp 420.000', status: 'success', statusLabel: 'Selesai' },
  { id: 1021, customer: 'Dewi Lestari', total: 'Rp 95.000', status: 'warning', statusLabel: 'Dikirim' }
]
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  color: #1e293b;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
}

.stat-change.up { color: #16a34a; }
.stat-change.down { color: #dc2626; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 16px;
  color: #1e293b;
  margin: 0;
}

.btn-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.activity-icon {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-text {
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 2px;
}

.activity-time {
  color: #94a3b8;
  font-size: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  text-align: left;
  padding: 10px 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 12px 8px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.success { background: #dcfce7; color: #16a34a; }
.badge.pending { background: #fef3c7; color: #d97706; }
.badge.warning { background: #dbeafe; color: #2563eb; }

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
