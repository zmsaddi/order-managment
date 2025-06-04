<template>
  <header class="flex items-center justify-between px-4 h-14 shadow-md bg-white">
    <!-- زر الهامبرغر للجوال -->
    <button class="p-2 md:hidden" @click="$emit('toggle-sidebar')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <h1 class="text-lg font-semibold text-gray-800">
      {{ pageTitle }}
    </h1>

    <!-- ملف شخصي -->
    <div class="relative">
      <button @click="open = !open" class="flex items-center gap-2">
        <!-- صورة أو دائرة باسم المستخدم -->
        <div
          class="w-8 h-8 rounded-full bg-sky-600 grid place-items-center text-white text-sm uppercase">
          {{ initials }}
        </div>
        <span class="hidden sm:inline whitespace-nowrap text-sm text-gray-600">{{ user.name }}</span>
      </button>

      <!-- القائمة المنسدلة -->
      <UserProfileMenu
        v-if="open"
        :user="user"
        @close="open = false"
        class="absolute left-0 mt-2 z-50"
      />
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import UserProfileMenu from '@/components/UserProfileMenu.vue'

export default {
  name: 'HeaderBar',
  components: {
    UserProfileMenu
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    pageTitle: {
      type: String,
      default: ''
    }
  },
  emits: ['toggle-sidebar'],
  setup(props) {
    /* حالة الفتح/الإغلاق */
    const open = ref(false)

    /* اختصار اسم المستخدم لعرضه في الدائرة */
    const initials = computed(() => {
      if (!props.user.name) return 'U'
      return props.user.name
        .split(' ')
        .map(p => p[0])
        .join('')
        .toUpperCase()
    })

    return {
      open,
      initials
    }
  }
}
</script>

