<template>
  <aside class="bg-sky-800 text-white w-64 flex-shrink-0 hidden md:block">
    <div class="p-4 border-b border-sky-700">
      <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
    </div>
    <nav class="mt-4">
      <ul class="space-y-1">
        <!-- لوحة التحكم - متاح للجميع -->
        <li>
          <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            <span>لوحة التحكم</span>
          </router-link>
        </li>
        
        <!-- إدارة المستخدمين - للمدراء فقط -->
        <li v-if="isAdmin">
          <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/users' }">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </span>
            <span>المستخدمين</span>
          </router-link>
        </li>
        
        <!-- الطلبات - متاح للجميع -->
        <li>
          <router-link to="/orders" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
            </span>
            <span>الطلبات</span>
          </router-link>
        </li>
        
        <!-- التقارير - متاح للجميع (مع اختلاف المحتوى حسب الدور) -->
        <li>
          <router-link to="/reports" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
            <span>التقارير</span>
          </router-link>
        </li>
        
        <!-- الملف الشخصي - متاح للجميع -->
        <li>
          <router-link to="/profile" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/profile' }">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
              </svg>
            </span>
            <span>الملف الشخصي</span>
          </router-link>
        </li>
        
        <!-- تسجيل الخروج - متاح للجميع -->
        <li>
          <button @click="logout" class="w-full flex items-center px-4 py-3 hover:bg-sky-700 transition-colors text-left">
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
              </svg>
            </span>
            <span>تسجيل الخروج</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'

export default {
  name: 'SidebarMenu',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
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
    
    return {
      isAdmin,
      logout
    }
  }
}
</script>
