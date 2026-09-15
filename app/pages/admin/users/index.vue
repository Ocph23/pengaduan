<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Manajemen User</h2>
        <p>Kelola semua pengguna terdaftar</p>
      </div>
        <a href="/admin/users/tambah" class="btn-primary">+ Tambah User</a>
    </div>

    <div class="card">
      <div class="card-toolbar">
        <input type="text" placeholder="Cari user..." class="search-input" />
        <select class="filter-select">
          <option>Semua Status</option>
          <option>Aktif</option>
          <option>Nonaktif</option>
        </select>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="avatar-sm">{{ user.name.charAt(0) }}</div>
                {{ user.name }}
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span class="badge" :class="user.status">
                {{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td>
              <button class="action-btn">✏️</button>
              <button class="action-btn">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Manajemen User - Admin'
})

const users = [
  { id: 1, name: 'Budi Santoso', email: 'budi@email.com', role: 'User', status: 'active' },
  { id: 2, name: 'Siti Aminah', email: 'siti@email.com', role: 'Admin', status: 'active' },
  { id: 3, name: 'Andi Wijaya', email: 'andi@email.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', role: 'Editor', status: 'active' }
]
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

.btn-primary:hover { background: #4f46e5; }

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

.search-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-input { flex: 1; min-width: 200px; }
.search-input:focus { border-color: #6366f1; }

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

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active { background: #dcfce7; color: #16a34a; }
.badge.inactive { background: #fee2e2; color: #dc2626; }

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn:hover { background: #f1f5f9; }
</style>
