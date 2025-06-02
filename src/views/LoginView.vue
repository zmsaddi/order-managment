<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white">
    <div class="card w-full max-w-md p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-sky-700 mb-2">نظام إدارة الطلبات</h1>
        <p class="text-gray-600">تسجيل الدخول للوصول إلى النظام</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="form-group">
          <label for="email" class="form-label">البريد الإلكتروني</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="form-input" 
            placeholder="أدخل البريد الإلكتروني" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">كلمة المرور</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-input" 
            placeholder="أدخل كلمة المرور" 
            required
          />
        </div>
        
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4">
          {{ errorMessage }}
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-full py-3" 
          :disabled="loading"
        >
          <span v-if="loading">جاري تسجيل الدخول...</span>
          <span v-else>تسجيل الدخول</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const errorMessage = ref('')
    
    const handleLogin = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        
        const result = await authService.login(email.value, password.value)
        
        // تخزين بيانات المستخدم في التخزين المحلي
        localStorage.setItem('user', JSON.stringify(result.user))
        
        // توجيه المستخدم إلى لوحة التحكم
        router.push({ name: 'dashboard' })
      } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error)
        errorMessage.value = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      email,
      password,
      loading,
      errorMessage,
      handleLogin
    }
  }
}
</script>
