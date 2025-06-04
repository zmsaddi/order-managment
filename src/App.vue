<template>
  <div id="app">
    <div v-if="isAuthenticated" class="min-h-screen bg-gray-50">
      <!-- القائمة الجانبية والمحتوى الرئيسي -->
      <div class="flex h-screen overflow-hidden">
        <!-- القائمة الجانبية للشاشات الكبيرة -->
        <SidebarMenu :user="user" class="hidden md:block" />
        
        <!-- المحتوى الرئيسي -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- محتوى الصفحة -->
          <router-view 
            @update-page-title="updatePageTitle" 
            :key="$route.fullPath"
          />
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
          <SidebarMenu :user="user" mobile @item-click="toggleSidebar" />
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

export default {
  name: 'App',
  components: {
    SidebarMenu
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
