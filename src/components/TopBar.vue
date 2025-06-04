<template>
  <header class="bg-white shadow-sm z-10">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center">
        <!-- زر فتح القائمة الجانبية للهواتف المحمولة - يظهر في الشريط العلوي بدلاً من أسفل الشاشة -->
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
</template>

<script>
import { inject } from 'vue'
import UserProfileMenu from '@/components/UserProfileMenu.vue'

export default {
  name: 'TopBar',
  components: {
    UserProfileMenu
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    user: {
      type: Object,
      required: true
    }
  },
  setup() {
    // الحصول على وظيفة تبديل القائمة الجانبية من الأب
    const toggleSidebar = inject('toggleSidebar')
    
    return {
      toggleSidebar
    }
  }
}
</script>
