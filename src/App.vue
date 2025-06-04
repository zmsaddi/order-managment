<template>
  <div id="app">
    <div v-if="isAuthenticated" class="min-h-screen bg-gray-50">
      <!-- القائمة الجانبية والمحتوى الرئيسي -->
      <div class="flex h-screen overflow-hidden">
        <!-- القائمة الجانبية للشاشات الكبيرة - ثابتة دائماً -->
        <SidebarMenu :user="user" class="hidden md:block" />
        
        <!-- المحتوى الرئيسي -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- الشريط العلوي - ثابت دائماً -->
          <TopBar :user="user" :pageTitle="pageTitle" />
          
          <!-- محتوى الصفحة - مع هامش علوي لتجنب تداخل الشريط العلوي -->
          <main class="flex-1 overflow-y-auto pt-16">
            <router-view 
              @update-page-title="updatePageTitle" 
              :key="$route.fullPath"
            />
          </main>
        </div>
      </div>
      
      <!-- القائمة الجانبية للجوال -->
      <div v-if="showMobileSidebar" class="fixed inset-0 z-50 md:hidden">
        <div class="absolute inset-0 bg-black opacity-50" @click="toggleSidebar"></div>
        <div class="absolute inset-y-0 right-0 w-64 bg-sky-800 text-white">
          <div class="p-4 border-b border-sky-700 flex justify-between items-center">
            <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
            <button @click="toggleSidebar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="mt-4">
            <ul class="space-y-1">
              <!-- لوحة التحكم - متاح للجميع -->
              <li>
                <router-link to="/dashboard" @click="toggleSidebar" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }">
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
                <router-link to="/orders" @click="toggleSidebar" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }">
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
                <router-link to="/reports" @click="toggleSidebar" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }">
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
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'
import SidebarMenu from '@/components/SidebarMenu.vue'
import TopBar from '@/components/TopBar.vue'

export default {
  name: 'App',
  components: {
    SidebarMenu,
    TopBar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const user = ref({})
    const isAuthenticated = ref(false)
    const showMobileSidebar = ref(false)
    const pageTitle = ref('')
    
    // تحديث عنوان الصفحة
    const updatePageTitle = (title) => {
      pageTitle.value = title
    }
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // التحقق من حالة المصادقة
    const checkAuth = async () => {
      try {
        const { user: authUser, session } = await authService.checkAuth()
        
        if (authUser) {
          user.value = authUser
          isAuthenticated.value = true
          localStorage.setItem('user', JSON.stringify(authUser))
          
          // إذا كان المستخدم في صفحة تسجيل الدخول، انقله إلى لوحة التحكم
          if (route.path === '/login' || route.path === '/') {
            router.push('/dashboard')
          }
        } else {
          isAuthenticated.value = false
          localStorage.removeItem('user')
          
          // إذا كان المستخدم في صفحة محمية، انقله إلى صفحة تسجيل الدخول
          if (route.path !== '/login' && route.path !== '/confirm-account') {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('خطأ في التحقق من المصادقة:', error)
        isAuthenticated.value = false
        localStorage.removeItem('user')
        router.push('/login')
      }
    }
    
    // توفير بيانات المستخدم وحالة القائمة الجانبية للمكونات الفرعية
    provide('user', user)
    provide('toggleSidebar', toggleSidebar)
    
    onMounted(() => {
      checkAuth()
    })
    
    return {
      user,
      isAuthenticated,
      showMobileSidebar,
      toggleSidebar,
      pageTitle,
      updatePageTitle
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
