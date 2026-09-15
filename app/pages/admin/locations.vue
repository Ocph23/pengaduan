<template>
  <div>
    <!-- Header Halaman -->
    <div class="page-header">
      <div>
        <h2>Manajemen lokasi</h2>
        <p>Kelola lokasi produk di toko Anda</p>
      </div>
      <button class="btn-primary" @click="openAddModal">
        + Tambah lokasi
      </button>
    </div>

    <!-- Card Tabel -->
    <div class="card">
      <div class="card-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="search" type="text" placeholder="Cari lokasi..." class="search-input" />
        </div>
      </div>

      <!-- Tabel -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 80px;">ID</th>
              <th>Nama lokasi</th>
              <th>Deskripsi</th>
              <th style="width: 140px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="3" class="empty-state">
                <div class="empty-icon">⏳</div>
                <p>Memuat data lokasi...</p>
              </td>
            </tr>
            <tr v-else-if="filteredlocations.length === 0">
              <td colspan="3" class="empty-state">
                <div class="empty-icon">📂</div>
                <p>Tidak ada lokasi ditemukan</p>
              </td>
            </tr>
            <tr v-else v-for="cat in filteredlocations" :key="cat.id">
              <td><code class="id-badge">{{ cat.id }}</code></td>
              <td class="name-cell">{{ cat.name }}</td>
              <td class="name-cell">{{ cat.description }}</td>
              <td>
                <div class="action-group">
                  <button class="action-btn edit" title="Edit" @click="openEditModal(cat)">
                    ✏️
                  </button>
                  <button class="action-btn delete" title="Hapus" @click="confirmDelete(cat)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Info jumlah data -->
      <div class="table-footer">
        <span>Menampilkan {{ filteredlocations.length }} dari {{ locations.length }} lokasi</span>
      </div>
    </div>

    <!-- ===== MODAL TAMBAH / EDIT ===== -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit lokasi' : 'Tambah lokasi Baru' }}</h3>
          <button class="close-modal" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveLocation">
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Nama lokasi <span class="required">*</span></label>
              <input id="name" v-model="form.name" type="text" placeholder="Contoh: Pakaian Pria" required autofocus />
            </div>
            <div class="form-group">
              <label for="name">Deskrispsi <span class="required">*</span></label>
              <input id="name" v-model="form.description" type="text" placeholder="Contoh: Pakaian Pria" required autofocus />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" :disabled="isSubmitting" @click="closeModal">
              Batal
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah lokasi') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI HAPUS ===== -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal modal-sm">
        <div class="modal-body" style="text-align: center; padding: 32px 24px;">
          <div class="delete-icon">🗑️</div>
          <h3 style="margin: 12px 0 8px; color: #1e293b;">Hapus lokasi?</h3>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            Anda yakin ingin menghapus lokasi
            <strong>"{{ categoryToDelete?.name }}"</strong>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="modal-footer" style="justify-content: center;">
            <button class="btn-secondary" :disabled="isSubmitting" @click="cancelDelete">Batal</button>
            <button class="btn-danger" :disabled="isSubmitting" @click="deleteCategory">
              {{ isSubmitting ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TOAST NOTIFICATION ===== -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Manajemen lokasi - Admin'
})

// ===== STATE =====
const locations = ref([])
const isLoading = ref(false)
const search = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)
const categoryToDelete = ref(null)

const form = reactive({
  name: '',
  description:''
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

// ===== METHODS =====
const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const fetchlocations = async () => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/locations')
    if (response && Array.isArray(response.data)) {
      locations.value = response.data
    } else if (Array.isArray(response)) {
      locations.value = response
    } else {
      locations.value = []
    }
  } catch (err) {
    const errorMsg = err.data?.statusMessage || err.message || 'Gagal memuat lokasi'
    showToast(errorMsg, 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchlocations()
})

// ===== COMPUTED =====
const filteredlocations = computed(() => {
  if (!locations.value || !Array.isArray(locations.value)) return []
  if (!search.value.trim()) return locations.value
  return locations.value.filter(cat =>
    cat.name && cat.name.toLowerCase().includes(search.value.trim().toLowerCase())
  )
})

const resetForm = () => {
  form.name = ''
  editingId.value = null
}

const openAddModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (category) => {
  resetForm()
  isEdit.value = true
  editingId.value = category.id
  form.name = category.name
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveLocation = async () => {
  if (!form.name.trim()) {
    showToast('Nama lokasi wajib diisi', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const data = { name: form.name.trim(), description:form.description }

    if (isEdit.value) {
      const res = await $fetch(`/api/locations/${editingId.value}`, {
        method: 'PUT',
        body: data
      })
      showToast(res?.message || 'lokasi berhasil diperbarui', 'success')
    } else {
      const res = await $fetch('/api/locations', {
        method: 'POST',
        body: data
      })
      showToast(res?.message || 'lokasi berhasil ditambahkan', 'success')
    }

    closeModal()
    await fetchlocations()
  } catch (error) {
    const message = error.data?.statusMessage || error.message || 'Gagal menyimpan lokasi'
    showToast(message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  categoryToDelete.value = null
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  isSubmitting.value = true
  try {
    const res = await $fetch(`/api/locations/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    })
    showToast(res?.message || 'lokasi berhasil dihapus', 'success')
    cancelDelete()
    await fetchlocations()
  } catch (error) {
    const message = error.data?.statusMessage || error.message || 'Gagal menghapus lokasi'
    showToast(message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h2 {
  color: #1e293b;
  margin: 0 0 4px 0;
  font-size: 20px;
}

.page-header p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.btn-primary {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover {
  background: #b91c1c;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #6366f1;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  text-align: left;
  padding: 12px 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 14px 8px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.empty-state {
  text-align: center;
  padding: 48px 8px !important;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.id-badge {
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}

.name-cell {
  font-weight: 500;
}

.action-group {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn.edit:hover {
  background: #dbeafe;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.table-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 13px;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease;
}

.modal-sm {
  max-width: 400px;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
}

.close-modal {
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.close-modal:hover {
  background: #f1f5f9;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
}

.required {
  color: #dc2626;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.delete-icon {
  width: 64px;
  height: 64px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto;
}

/* ===== TOAST ===== */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #fff;
  padding: 14px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 200;
  border-left: 4px solid #16a34a;
}

.toast.error {
  border-left-color: #dc2626;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>