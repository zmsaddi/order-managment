<template>
  <div id="app">
    <div v-if="isAuthenticated" class="min-h-screen bg-gray-50">
      <!-- القائمة الجانبية والشريط العلوي -->
      <div class="flex h-screen overflow-hidden">
        <!-- القائمة الجانبية -->
        <SidebarMenu :user="user" />
        
        <!-- المحتوى الرئيسي -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- الشريط العلوي -->
          <header class="bg-white shadow-sm z-10">
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center">
                <button @click="toggleSidebar" class="md:hidden ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
              </div>
              <div class="flex items-center">
                <UserProfileMenu :user="user" />
              </div>
            </div>
          </header>
          
          <!-- محتوى الصفحة -->
          <main class="flex-1 overflow-y-auto">
            <router-view @update-page-title="updatePageTitle" />
          </main>
        </div>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'
import SidebarMenu from '@/components/SidebarMenu.vue'
import UserProfileMenu from '@/components/UserProfileMenu.vue'

export default {
  name: 'App',
  components: {
    SidebarMenu,
    UserProfileMenu
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
    
    // تعيين عنوان الصفحة الافتراضي بناءً على المسار
    const setDefaultPageTitle = () => {
      switch (route.path) {
        case '/dashboard':
          pageTitle.value = 'لوحة التحكم'
          break
        case '/orders':
          pageTitle.value = 'الطلبات'
          break
        case '/reports':
          pageTitle.value = 'التقارير'
          break
        case '/users':
          pageTitle.value = 'المستخدمين'
          break
        case '/profile':
          pageTitle.value = 'الملف الشخصي'
          break
        default:
          if (route.path.startsWith('/orders/')) {
            pageTitle.value = 'تفاصيل الطلب'
          } else {
            pageTitle.value = 'نظام إدارة الطلبات'
          }
      }
    }
    
    // مراقبة تغيير المسار لتحديث عنوان الصفحة
    watch(() => route.path, () => {
      setDefaultPageTitle()
    })
    
    onMounted(() => {
      checkAuth()
      setDefaultPageTitle()
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
