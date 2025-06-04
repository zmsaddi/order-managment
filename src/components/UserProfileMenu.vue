<template>
  <div class="w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
    <div class="py-2 px-4 border-b border-gray-100">
      <p class="text-sm font-medium text-gray-900 text-center">{{ user.name }}</p>
      <p class="text-xs text-gray-500 text-center">{{ user.email }}</p>
    </div>
    <div class="py-1">
      <!-- الملف الشخصي -->
      <router-link 
        to="/profile" 
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        @click="$emit('close')"
      >
        <span class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
          </svg>
        </span>
        <span>الملف الشخصي</span>
      </router-link>
      
      <!-- إدارة المستخدمين - للمدراء فقط -->
      <router-link 
        v-if="isAdmin" 
        to="/users" 
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        @click="$emit('close')"
      >
        <span class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </span>
        <span>المستخدمين</span>
      </router-link>
    </div>
    <div class="py-1 border-t border-gray-100">
      <!-- تسجيل الخروج -->
      <button 
        @click="logoutAndClose" 
        class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-right"
      >
        <span class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
        </span>
        <span>تسجيل الخروج</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'

export default {
  name: 'UserProfileMenu',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(props.user.role)
    })
    
    // تسجيل الخروج
    const logout = async () => {
      try {
        await authService.logout()
        localStorage.removeItem('user')
        router.push({ name: 'login' })
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
    
    const logoutAndClose = async () => {
      emit('close')
      await logout()
    }
    
    return {
      isAdmin,
      logout,
      logoutAndClose
    }
  }
}
</script>

<style scoped>
/* تحسين مظهر القائمة المنسدلة */
.router-link-active {
  background-color: #f3f4f6;
  font-weight: 500;
}
</style>
