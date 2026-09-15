<template>
  <div class="login-container">
    <h2>Login Sistem</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          placeholder="Masukkan username"
          required 
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          placeholder="Masukkan password"
          required 
        />
      </div>
      
      <p v-if="error" class="error-message">{{ error }}</p>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup>
const form = ref({ username: '', password: '' });
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: form.value
    });
    
    console.log('Login berhasil:', response);
    alert(`Selamat datang, ${response.user.username}! (Role: ${response.user.role})`);
    
    
  } catch (err) {
    error.value = err.data?.statusMessage || 'Terjadi kesalahan pada server';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  font-family: system-ui, -apple-system, sans-serif;
}

h2 {
  text-align: center;
  color: #1e293b;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #00dc82;
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.1);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #00dc82;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #00c472;
}

button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}
</style>
