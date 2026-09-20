<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Dashboard Pengaduan</h2>
        <p>Pantau ringkasan laporan siswa dan guru.</p>
      </div>
      <NuxtLink class="btn-primary" to="/admin/reports">Kelola Laporan</NuxtLink>
    </div>

    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :class="stat.className">{{ stat.icon }}</div>
        <div class="stat-info">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-note">{{ stat.note }}</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <section class="card">
        <div class="card-header">
          <h2>Status Laporan</h2>
          <button class="btn-link" type="button" @click="fetchReports">Muat Ulang</button>
        </div>

        <div v-if="isLoading" class="empty-state">Memuat ringkasan...</div>
        <div v-else class="status-list">
          <div v-for="item in statusSummary" :key="item.status" class="status-row">
            <div class="status-text">
              <span class="status-dot" :class="item.status"></span>
              <span>{{ item.label }}</span>
            </div>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2>Laporan Terbaru</h2>
          <NuxtLink class="btn-link" to="/admin/reports">Lihat Semua</NuxtLink>
        </div>

        <div v-if="isLoading" class="empty-state">Memuat laporan...</div>
        <div v-else-if="latestReports.length === 0" class="empty-state">Belum ada laporan.</div>
        <div v-else class="report-list">
          <article v-for="report in latestReports" :key="report.id" class="report-item">
            <div class="report-main">
              <div>
                <h3>{{ report.title }}</h3>
                <p>{{ report.reporter_name }} · {{ report.reporter_type }}</p>
              </div>
              <span class="badge" :class="report.status">{{ statusLabel(report.status) }}</span>
            </div>
            <div class="report-meta">
              <span>{{ report.category_name || 'Tanpa kategori' }}</span>
              <span>{{ report.location_name || 'Tanpa lokasi' }}</span>
              <span>{{ formatDate(report.created_at) }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard Pengaduan - Admin'
})

const reports = ref([])
const isLoading = ref(false)

const normalizeList = (response) => {
  if (response && Array.isArray(response.data)) return response.data
  if (Array.isArray(response)) return response
  return []
}

const statusLabel = (status) => ({
  baru: 'Baru',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak'
}[status] || status)

const formatDate = (value) => new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value))

const countByStatus = (status) => reports.value.filter(report => report.status === status).length

const statusSummary = computed(() => [
  { status: 'baru', label: 'Baru', count: countByStatus('baru') },
  { status: 'diproses', label: 'Diproses', count: countByStatus('diproses') },
  { status: 'selesai', label: 'Selesai', count: countByStatus('selesai') },
  { status: 'ditolak', label: 'Ditolak', count: countByStatus('ditolak') }
])

const latestReports = computed(() => reports.value.slice(0, 5))

const stats = computed(() => [
  {
    label: 'Total Laporan',
    value: reports.value.length,
    note: 'Semua laporan masuk',
    icon: 'L',
    className: 'blue'
  },
  {
    label: 'Laporan Baru',
    value: countByStatus('baru'),
    note: 'Menunggu tindak lanjut',
    icon: 'B',
    className: 'amber'
  },
  {
    label: 'Diproses',
    value: countByStatus('diproses'),
    note: 'Sedang ditangani',
    icon: 'P',
    className: 'indigo'
  },
  {
    label: 'Selesai',
    value: countByStatus('selesai'),
    note: 'Sudah dituntaskan',
    icon: 'S',
    className: 'green'
  }
])

const fetchReports = async () => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/reports')
    reports.value = normalizeList(response)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchReports)
</script>

<style scoped>
.page-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header h2 {
  color: #1e293b;
  font-size: 22px;
  margin: 0 0 4px;
}

.page-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.btn-primary {
  background: #2563eb;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 14px;
  text-decoration: none;
}

.stats-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  margin-bottom: 22px;
}

.stat-card {
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 14px;
  padding: 18px;
}

.stat-icon {
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-weight: 800;
  height: 46px;
  justify-content: center;
  width: 46px;
}

.stat-icon.blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-icon.amber {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon.indigo {
  background: #e0e7ff;
  color: #4338ca;
}

.stat-icon.green {
  background: #dcfce7;
  color: #166534;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 3px;
}

.stat-value {
  color: #1e293b;
  font-size: 24px;
  font-weight: 800;
}

.stat-note {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 2px;
}

.content-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 0.85fr 1.15fr;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.card-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-header h2 {
  color: #1e293b;
  font-size: 17px;
  margin: 0;
}

.btn-link {
  background: none;
  border: 0;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.empty-state {
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
  font-weight: 700;
  padding: 28px 12px;
  text-align: center;
}

.status-list {
  display: grid;
  gap: 10px;
}

.status-row {
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  padding: 12px;
}

.status-text {
  align-items: center;
  color: #334155;
  display: flex;
  font-weight: 700;
  gap: 10px;
}

.status-dot {
  border-radius: 999px;
  height: 10px;
  width: 10px;
}

.status-dot.baru {
  background: #1d4ed8;
}

.status-dot.diproses {
  background: #d97706;
}

.status-dot.selesai {
  background: #16a34a;
}

.status-dot.ditolak {
  background: #dc2626;
}

.report-list {
  display: grid;
  gap: 12px;
}

.report-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
}

.report-main {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.report-main h3 {
  color: #1e293b;
  font-size: 15px;
  margin: 0 0 4px;
}

.report-main p {
  color: #64748b;
  font-size: 13px;
  margin: 0;
  text-transform: capitalize;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.report-meta span,
.badge {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 9px;
}

.report-meta span {
  background: #f1f5f9;
  color: #475569;
}

.badge.baru {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.diproses {
  background: #fef3c7;
  color: #92400e;
}

.badge.selesai {
  background: #dcfce7;
  color: #166534;
}

.badge.ditolak {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
