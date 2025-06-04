<template>
  <div class="relative">
    <button @click="toggleDropdown" class="flex items-center focus:outline-none">
      <span class="text-sm text-gray-600 ml-2 hidden md:block">{{ user.name }}</span>
      <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
        {{ user.name ? user.name.charAt(0) : 'U' }}
      </div>
    </button>
    
    <div v-if="showDropdown" class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
      <div class="py-1">
        <router-link to="/profile" @click="closeDropdown" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          الملف الشخصي
        </router-link>
        <button @click="logout" class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          تسجيل الخروج
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
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
  setup(props) {
    const router = useRouter()
    const showDropdown = ref(false)
    
    // تبديل حالة القائمة المنسدلة
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }
    
    // إغلاق القائمة المنسدلة
    const closeDropdown = () => {
      showDropdown.value = false
    }
    
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
    
    // إغلاق القائمة المنسدلة عند النقر خارجها
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.relative')
      if (dropdown && !dropdown.contains(event.target)) {
        showDropdown.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      showDropdown,
      toggleDropdown,
      closeDropdown,
      logout
    }
  }
}
</script>
