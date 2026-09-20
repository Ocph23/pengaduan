<template>
  <main class="report-page">
    <header class="topbar">
      <div>
        <p class="eyebrow">Sistem Pengaduan SMK</p>
        <h1>Pelaporan Siswa dan Guru</h1>
      </div>
      <div v-if="currentUser" class="user-box">
        <div>
          <strong>{{ currentUser.name }}</strong>
          <span>{{ currentUser.role }}</span>
        </div>
        <button type="button" @click="logout">Logout</button>
      </div>
    </header>

    <section class="report-shell">
      <form class="panel" @submit.prevent="submitReport">
        <div class="section-heading">
          <h2>Buat Laporan</h2>
          <p>Laporan tercatat sesuai akun yang sedang login.</p>
        </div>

        <div v-if="currentUser" class="profile-grid">
          <div>
            <span>Pelapor</span>
            <strong>{{ currentUser.name }}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{{ currentUser.role }}</strong>
          </div>
          <div>
            <span>Nomor Induk</span>
            <strong>{{ currentUser.nomor_induk || '-' }}</strong>
          </div>
          <div>
            <span>No. HP</span>
            <strong>{{ currentUser.phone_number || '-' }}</strong>
          </div>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Kategori</span>
            <select v-model="form.categoryId">
              <option value="">Pilih kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Lokasi kejadian</span>
            <select v-model="form.locationId">
              <option value="">Pilih lokasi</option>
              <option v-for="location in locations" :key="location.id" :value="location.id">
                {{ location.name }}
              </option>
            </select>
          </label>
        </div>

        <label class="field">
          <span>Judul laporan <strong>*</strong></span>
          <input v-model="form.title" type="text" placeholder="Contoh: Keran air kamar mandi rusak" required />
        </label>

        <label class="field">
          <span>Isi laporan <strong>*</strong></span>
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Tuliskan kronologi atau kondisi yang perlu ditangani"
            required
          ></textarea>
        </label>

        <p v-if="message.text" class="message" :class="message.type">
          {{ message.text }}
        </p>

        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Mengirim...' : 'Kirim Laporan' }}
        </button>
      </form>

      <section class="panel">
        <div class="section-heading">
          <h2>Status Laporan Saya</h2>
          <p>Pantau perubahan status laporan dari admin.</p>
        </div>

        <div v-if="isLoadingReports" class="empty-state">Memuat laporan...</div>
        <div v-else-if="reports.length === 0" class="empty-state">Belum ada laporan.</div>
        <div v-else class="report-list">
          <article v-for="report in reports" :key="report.id" class="report-card">
            <div class="report-card-header">
              <div>
                <strong>{{ report.title }}</strong>
                <span>{{ formatDate(report.created_at) }}</span>
              </div>
              <span class="status-badge" :class="report.status">{{ statusLabel(report.status) }}</span>
            </div>
            <p>{{ report.description }}</p>
            <div class="report-meta">
              <span>{{ report.category_name || 'Tanpa kategori' }}</span>
              <span>{{ report.location_name || 'Tanpa lokasi' }}</span>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: 'Pelaporan Siswa dan Guru'
})

const currentUser = ref(null)
const categories = ref([])
const locations = ref([])
const reports = ref([])
const isSubmitting = ref(false)
const isLoadingReports = ref(false)

const form = reactive({
  categoryId: '',
  locationId: '',
  title: '',
  description: ''
})

const message = reactive({
  text: '',
  type: 'success'
})

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

const loadSession = async () => {
  const response = await $fetch('/api/me')
  if (!response.authenticated || !response.user) {
    return navigateTo('/login')
  }

  if (response.user.role === 'admin') {
    return navigateTo('/admin/reports')
  }

  currentUser.value = response.user
}

const loadOptions = async () => {
  const [categoryResponse, locationResponse] = await Promise.all([
    $fetch('/api/categories'),
    $fetch('/api/locations')
  ])

  categories.value = normalizeList(categoryResponse)
  locations.value = normalizeList(locationResponse)
}

const loadReports = async () => {
  isLoadingReports.value = true
  try {
    const response = await $fetch('/api/reports')
    reports.value = normalizeList(response)
  } finally {
    isLoadingReports.value = false
  }
}

const resetForm = () => {
  form.categoryId = ''
  form.locationId = ''
  form.title = ''
  form.description = ''
}

const submitReport = async () => {
  isSubmitting.value = true
  message.text = ''

  try {
    const response = await $fetch('/api/reports', {
      method: 'POST',
      body: {
        categoryId: form.categoryId || null,
        locationId: form.locationId || null,
        title: form.title,
        description: form.description
      }
    })

    message.text = response?.message || 'Laporan berhasil dikirim'
    message.type = 'success'
    resetForm()
    await loadReports()
  } catch (error) {
    message.text = error.data?.statusMessage || error.message || 'Gagal mengirim laporan'
    message.type = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const logout = async () => {
  await $fetch('/api/logout', { method: 'POST' })
  navigateTo('/login')
}

onMounted(async () => {
  await loadSession()
  await Promise.all([loadOptions(), loadReports()])
})
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: #eef2f7;
  color: #172033;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 28px 18px;
}

.topbar {
  width: min(1180px, 100%);
  margin: 0 auto 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 6px;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  font-size: 32px;
  margin-bottom: 0;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid #dfe7f1;
  border-radius: 8px;
  padding: 10px 12px;
}

.user-box div {
  display: grid;
}

.user-box span {
  color: #64748b;
  font-size: 13px;
  text-transform: capitalize;
}

.user-box button {
  border: 0;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font-weight: 700;
  padding: 8px 10px;
}

.report-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 22px;
  align-items: start;
}

.panel {
  background: #ffffff;
  border: 1px solid #dfe7f1;
  border-radius: 8px;
  box-shadow: 0 18px 38px rgba(26, 43, 72, 0.08);
  padding: 24px;
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.section-heading p {
  color: #64748b;
  margin-bottom: 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.profile-grid div {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px;
}

.profile-grid span {
  color: #64748b;
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
}

.profile-grid strong {
  color: #1e293b;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: grid;
  gap: 7px;
  margin-bottom: 16px;
}

.field span {
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.field strong {
  color: #dc2626;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  box-sizing: border-box;
  color: #172033;
  font: inherit;
  padding: 11px 12px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.14);
}

textarea {
  min-height: 132px;
  resize: vertical;
}

.submit-button {
  width: 100%;
  border: 0;
  border-radius: 6px;
  background: #0f766e;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  padding: 13px 16px;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.message,
.empty-state {
  border-radius: 6px;
  padding: 12px 14px;
  font-weight: 700;
}

.message.success {
  background: #dcfce7;
  color: #166534;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  background: #f8fafc;
  color: #64748b;
  text-align: center;
}

.report-list {
  display: grid;
  gap: 12px;
}

.report-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
}

.report-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.report-card-header div {
  display: grid;
  gap: 4px;
}

.report-card-header span {
  color: #64748b;
  font-size: 13px;
}

.report-card p {
  color: #334155;
  line-height: 1.55;
  margin-bottom: 12px;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.report-meta span,
.status-badge {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 9px;
}

.report-meta span {
  background: #f1f5f9;
  color: #475569;
}

.status-badge.baru {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.diproses {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.selesai {
  background: #dcfce7;
  color: #166534;
}

.status-badge.ditolak {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 900px) {
  .report-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .field-grid,
  .profile-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  h1 {
    font-size: 27px;
  }
}
</style>
