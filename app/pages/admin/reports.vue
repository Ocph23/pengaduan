<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Manajemen Laporan</h2>
        <p>Kelola status laporan dari siswa dan guru</p>
      </div>
      <button class="btn-secondary" type="button" @click="fetchReports">Muat Ulang</button>
    </div>

    <div class="card">
      <div class="card-toolbar">
        <input v-model="search" type="text" placeholder="Cari laporan..." class="search-input" />
        <select v-model="statusFilter" class="filter-select">
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pelapor</th>
              <th>Laporan</th>
              <th>Kategori</th>
              <th>Lokasi</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="empty-state">Memuat laporan...</td>
            </tr>
            <tr v-else-if="filteredReports.length === 0">
              <td colspan="6" class="empty-state">Tidak ada laporan ditemukan</td>
            </tr>
            <tr v-else v-for="report in filteredReports" :key="report.id">
              <td>
                <div class="reporter-cell">
                  <strong>{{ report.reporter_name }}</strong>
                  <span>{{ report.reporter_type }} · {{ report.reporter_identifier || '-' }}</span>
                </div>
              </td>
              <td>
                <div class="report-cell">
                  <strong>{{ report.title }}</strong>
                  <span>{{ report.description }}</span>
                </div>
              </td>
              <td>{{ report.category_name || '-' }}</td>
              <td>{{ report.location_name || '-' }}</td>
              <td>{{ formatDate(report.created_at) }}</td>
              <td>
                <select
                  class="status-select"
                  :class="report.status"
                  :value="report.status"
                  :disabled="updatingId === report.id"
                  @change="updateStatus(report, $event.target.value)"
                >
                  <option value="baru">Baru</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Manajemen Laporan - Admin'
})

const reports = ref([])
const isLoading = ref(false)
const updatingId = ref(null)
const search = ref('')
const statusFilter = ref('')

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const normalizeList = (response) => {
  if (response && Array.isArray(response.data)) return response.data
  if (Array.isArray(response)) return response
  return []
}

const formatDate = (value) => new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value))

const fetchReports = async () => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/reports')
    reports.value = normalizeList(response)
  } catch (error) {
    showToast(error.data?.statusMessage || 'Gagal memuat laporan', 'error')
  } finally {
    isLoading.value = false
  }
}

const filteredReports = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return reports.value.filter((report) => {
    const statusMatch = !statusFilter.value || report.status === statusFilter.value
    if (!keyword) return statusMatch

    const haystack = [
      report.reporter_name,
      report.reporter_identifier,
      report.title,
      report.description,
      report.category_name,
      report.location_name
    ].join(' ').toLowerCase()

    return statusMatch && haystack.includes(keyword)
  })
})

const updateStatus = async (report, status) => {
  updatingId.value = report.id
  const previousStatus = report.status
  report.status = status

  try {
    await $fetch(`/api/reports/${report.id}`, {
      method: 'PUT',
      body: { status }
    })
    showToast('Status laporan berhasil diperbarui')
  } catch (error) {
    report.status = previousStatus
    showToast(error.data?.statusMessage || 'Gagal memperbarui status', 'error')
  } finally {
    updatingId.value = null
  }
}

onMounted(fetchReports)
</script>

<style scoped>
.page-header {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header h2 {
  color: #1e293b;
  font-size: 20px;
  margin: 0 0 4px;
}

.page-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.btn-secondary {
  background: #f1f5f9;
  border: 0;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 14px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.card-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input,
.filter-select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
  outline: none;
  padding: 9px 11px;
}

.search-input {
  min-width: 240px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}

.data-table th {
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  padding: 12px 8px;
  text-align: left;
  text-transform: uppercase;
}

.data-table td {
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  padding: 14px 8px;
  vertical-align: top;
}

.reporter-cell,
.report-cell {
  display: grid;
  gap: 4px;
  min-width: 170px;
}

.reporter-cell span,
.report-cell span {
  color: #64748b;
  font-size: 13px;
  line-height: 1.4;
}

.report-cell {
  min-width: 260px;
}

.status-select {
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 800;
  padding: 7px 10px;
}

.status-select.baru {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-select.diproses {
  background: #fef3c7;
  color: #92400e;
}

.status-select.selesai {
  background: #dcfce7;
  color: #166534;
}

.status-select.ditolak {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  color: #64748b;
  padding: 40px 8px !important;
  text-align: center;
}

.toast {
  background: #fff;
  border-left: 4px solid #16a34a;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
  font-weight: 700;
  padding: 14px 18px;
  position: fixed;
  right: 24px;
  top: 24px;
  z-index: 200;
}

.toast.error {
  border-left-color: #dc2626;
}
</style>
