<template>
  <!-- القائمة الجانبية للشاشات الكبيرة -->
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
      </ul>
    </nav>
  </aside>

  <!-- القائمة الجانبية للهواتف المحمولة -->
  <div v-if="mobileOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden">
    <div class="bg-sky-800 text-white h-full w-64 overflow-y-auto">
      <div class="flex justify-between items-center p-4 border-b border-sky-700">
        <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
        <button @click="$emit('close')" class="text-white focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="mt-4">
        <ul class="space-y-1">
          <!-- لوحة التحكم - متاح للجميع -->
          <li>
            <router-link to="/dashboard" @click="$emit('close')" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }">
              <span class="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
              <span>لوحة التحكم</span>
            </router-link>
          </li>
          
          <!-- الطلبات - متاح للجميع -->
          <li>
            <router-link to="/orders" @click="$emit('close')" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }">
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
            <router-link to="/reports" @click="$emit('close')" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }">
              <span class="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </span>
              <span>التقارير</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- طبقة تعتيم تُغلق القائمة عند النقر -->
  <div
    v-if="mobileOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/40 md:hidden"
  />
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
    },
    mobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props) {
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

