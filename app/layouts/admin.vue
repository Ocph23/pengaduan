<template>
  <div class="admin-layout">
    <!-- Overlay untuk mobile -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">PANEL</span>
        </div>
        <button class="close-btn" @click="isSidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-menu">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: isActive(item.path) }"
          @click="isSidebarOpen = false"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">{{ adminInitial }}</div>
          <div class="user-detail">
            <div class="user-name">{{ currentUser?.name || 'Admin' }}</div>
            <div class="user-role">{{ currentUser?.role || 'Admin' }}</div>
          </div>
        </div>
        <button class="logout-sidebar" type="button" @click="logout">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Header -->
      <header class="top-header">
        <button class="toggle-btn" @click="isSidebarOpen = !isSidebarOpen">
          ☰
        </button>
        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="Notifikasi">🔔</button>
          <button class="icon-btn" title="Pengaturan">⚙️</button>
          <button class="logout-btn" type="button" @click="logout">Logout</button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const isSidebarOpen = ref(false)
const currentUser = ref(null)

const menuItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/reports', icon: '📝', label: 'Laporan' },
  { path: '/admin/users', icon: '👥', label: 'Data Pengguna' },
  { path: '/admin/categories', icon: '📦', label: 'Kategori' },
  { path: '/admin/locations', icon: '🛒', label: 'Lokasi' },
]

// Cek apakah menu aktif (termasuk path parent)
const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

// Judul halaman berdasarkan route
const currentPageTitle = computed(() => {
  const active = menuItems.find(item => isActive(item.path))
  return active?.label || 'Admin'
})

const adminInitial = computed(() => {
  return currentUser.value?.name?.charAt(0)?.toUpperCase() || 'A'
})

const logout = async () => {
  await $fetch('/api/logout', { method: 'POST' })
  currentUser.value = null
  navigateTo('/login')
}

onMounted(async () => {
  const response = await $fetch('/api/me')
  if (!response.authenticated || !response.user) {
    return navigateTo('/login')
  }

  if (response.user.role !== 'admin') {
    return navigateTo('/lapor')
  }

  currentUser.value = response.user
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 40;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

.logo-icon {
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 20px;
  cursor: pointer;
  display: none;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.menu-item.active {
  background: rgba(99, 102, 241, 0.15);
  color: #fff;
  border-left-color: #6366f1;
}

.menu-icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-name {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.user-role {
  color: #94a3b8;
  font-size: 12px;
}

.logout-sidebar {
  width: 100%;
  margin-top: 14px;
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  border: 1px solid rgba(248, 113, 113, 0.24);
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.logout-sidebar:hover {
  background: rgba(248, 113, 113, 0.2);
  color: #fff;
}

/* ===== MAIN WRAPPER ===== */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-header {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-title h1 {
  font-size: 20px;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #1e293b;
  display: none;
  padding: 4px 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #e2e8f0;
}

.logout-btn {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  min-width: 78px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 14px;
}

.logout-btn:hover {
  background: #fecaca;
}

.content {
  flex: 1;
  padding: 24px;
}

/* ===== RESPONSIVE ===== */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 35;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar.open ~ .sidebar-overlay,
  .sidebar-overlay {
    display: block;
  }

  .close-btn {
    display: block;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .toggle-btn {
    display: block;
  }
}
</style>
