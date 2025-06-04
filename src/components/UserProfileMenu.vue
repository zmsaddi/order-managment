<template>
  <div class="relative">
    <!-- زر المستخدم -->
    <button 
      @click="toggleMenu" 
      class="flex items-center focus:outline-none"
      ref="profileButton"
    >
      <span class="text-sm text-gray-600 ml-2 hidden sm:block">{{ user.name }}</span>
      <div class="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white shadow-sm hover:bg-sky-700 transition-colors">
        {{ user.name ? user.name.charAt(0) : 'U' }}
      </div>
    </button>
    
    <!-- القائمة المنسدلة -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        ref="profileMenu"
      >
        <div class="py-2 px-4 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900 text-center">{{ user.name }}</p>
          <p class="text-xs text-gray-500 text-center">{{ user.email }}</p>
        </div>
        <div class="py-1">
          <!-- الملف الشخصي -->
          <router-link 
            to="/profile" 
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
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
            @click="closeMenu"
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
          <a 
            href="#" 
            @click.prevent="logoutAndCloseMenu" 
            class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-right"
          >
            <span class="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
              </svg>
            </span>
            <span>تسجيل الخروج</span>
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

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
    const isOpen = ref(false)
    const profileButton = ref(null)
    const profileMenu = ref(null)
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(props.user.role)
    })
    
    // فتح وإغلاق القائمة
    const toggleMenu = () => {
      isOpen.value = !isOpen.value
    }
    
    const closeMenu = () => {
      isOpen.value = false
    }
    
    // تسجيل الخروج - تم تعديله للعمل مباشرة مع Supabase
    const logout = async () => {
      try {
        // تسجيل الخروج من Supabase
        await supabase.auth.signOut()
        
        // حذف بيانات المستخدم من localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token')
        
        // توجيه المستخدم إلى صفحة تسجيل الدخول
        router.push({ name: 'login' })
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
        
        // في حالة حدوث خطأ، حاول مسح localStorage والتوجيه إلى صفحة تسجيل الدخول على أي حال
        localStorage.clear()
        router.push({ name: 'login' })
      }
    }
    
    const logoutAndCloseMenu = async () => {
      closeMenu()
      await logout()
    }
    
    // إغلاق القائمة عند النقر خارجها
    const handleClickOutside = (event) => {
      if (
        isOpen.value && 
        profileMenu.value && 
        profileButton.value && 
        !profileMenu.value.contains(event.target) && 
        !profileButton.value.contains(event.target)
      ) {
        closeMenu()
      }
    }
    
    // إضافة مستمع الحدث للنقر خارج القائمة على الكمبيوتر
    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
      
      // إضافة مستمع الحدث للنقر خارج القائمة على الهاتف
      document.addEventListener('touchend', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    })
    
    return {
      isOpen,
      isAdmin,
      toggleMenu,
      closeMenu,
      logout,
      logoutAndCloseMenu,
      profileButton,
      profileMenu
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
