<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- الترويسة الموحَّدة -->
    <HeaderBar
      :user="user"
      :page-title="activeTitle"
      @toggle-sidebar="mobileOpen = !mobileOpen"
    />

    <div class="flex flex-1">
      <!-- الشريط الجانبي -->
      <SidebarMenu
        :user="user"
        :mobile-open="mobileOpen"
        @close="mobileOpen = false"
      />

      <!-- محتوى الصفحة -->
      <main class="flex-1 overflow-y-auto p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import HeaderBar from '@/components/HeaderBar.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

export default {
  name: 'MainLayout',
  components: {
    HeaderBar,
    SidebarMenu
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    /* حالة الشريط الجانبي للجوال */
    const mobileOpen = ref(false)
    
    /* بيانات المستخدم */
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    /* عنوان الصفحة بناءً على مسار الراوتر */
    const activeTitle = ref('')
    
    // تحديث عنوان الصفحة عند تغيير المسار
    watch(
      () => route.meta.title,
      (newTitle) => {
        activeTitle.value = newTitle || ''
      },
      { immediate: true }
    )
    
    // التحقق من وجود بيانات المستخدم عند تحميل الصفحة
    onMounted(async () => {
      if (!user.value.id) {
        try {
          const { user: authUser } = await authService.checkAuth()
          if (authUser) {
            user.value = authUser
            localStorage.setItem('user', JSON.stringify(authUser))
          } else {
            router.push({ name: 'login' })
          }
        } catch (error) {
          console.error('خطأ في التحقق من حالة المصادقة:', error)
          router.push({ name: 'login' })
        }
      }
    })
    
    return {
      mobileOpen,
      user,
      activeTitle
    }
  }
}
</script>

