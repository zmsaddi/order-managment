<template>
  <div>
    <!-- الشريط العلوي -->
    <header class="bg-white shadow-sm z-10">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="md:hidden ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-800">لوحة التحكم</h2>
        </div>
        <div class="flex items-center">
          <UserProfileMenu :user="user" />
        </div>
      </div>
    </header>
    
    <!-- محتوى الصفحة -->
    <main class="flex-1 overflow-y-auto p-4">
      <!-- ملخص الإحصائيات -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-sky-100 text-sky-600 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">إجمالي الطلبات</p>
              <p class="text-2xl font-semibold text-gray-800">{{ stats.totalOrders }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">الطلبات المكتملة</p>
              <p class="text-2xl font-semibold text-gray-800">{{ stats.completedOrders }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">الطلبات الجديدة</p>
              <p class="text-2xl font-semibold text-gray-800">{{ stats.newOrders }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm">إجمالي المبيعات</p>
              <p class="text-2xl font-semibold text-gray-800">{{ formatCurrency(stats.totalSales) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- أحدث الطلبات -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">أحدث الطلبات</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتج
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجمالي
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                  جاري تحميل البيانات...
                </td>
              </tr>
              <tr v-else-if="recentOrders.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                  لا توجد طلبات حتى الآن
                </td>
              </tr>
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.customer_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ truncateText(order.product_description, 30) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(order.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/orders/${order.id}`" class="text-sky-600 hover:text-sky-900 ml-3">
                    عرض
                  </router-link>
                  <router-link v-if="canEditOrder(order)" :to="`/orders/edit/${order.id}`" class="text-sky-600 hover:text-sky-900">
                    تعديل
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t border-gray-200 text-center">
          <router-link to="/orders" class="text-sky-600 hover:text-sky-900 text-sm font-medium">
            عرض جميع الطلبات
          </router-link>
        </div>
      </div>
      
      <!-- الرسوم البيانية -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- توزيع حالات الطلبات -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">توزيع حالات الطلبات</h2>
          <div class="h-64 flex items-center justify-center">
            <p class="text-gray-500">الرسوم البيانية غير متاحة حالياً</p>
          </div>
        </div>
        
        <!-- المبيعات الشهرية -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">المبيعات الشهرية</h2>
          <div class="h-64 flex items-center justify-center">
            <p class="text-gray-500">الرسوم البيانية غير متاحة حالياً</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { supabase } from '@/services/supabase'
import UserProfileMenu from '@/components/UserProfileMenu.vue'
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusClass } from '@/utils/formatters'

export default {
  name: 'DashboardView',
  components: {
    UserProfileMenu
  },
  setup() {
    const loading = ref(true)
    const recentOrders = ref([])
    const stats = ref({
      totalOrders: 0,
      completedOrders: 0,
      newOrders: 0,
      totalSales: 0
    })
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // الحصول على وظيفة تبديل القائمة الجانبية من الأب
    const toggleSidebar = inject('toggleSidebar')
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // التحقق من إمكانية تعديل الطلب
    const canEditOrder = (order) => {
      // المدراء يمكنهم تعديل أي طلب
      if (isAdmin.value) return true
      
      // المندوب يمكنه تعديل طلباته فقط
      return user.value.id === order.sales_rep_id
    }
    
    // الحصول على نص حالة الطلب
    const getStatusText = (status) => {
      return getOrderStatusText(status)
    }
    
    // الحصول على فئة CSS لحالة الطلب
    const getStatusClass = (status) => {
      return getOrderStatusClass(status)
    }
    
    // اقتطاع النص إذا كان طويلاً
    const truncateText = (text, length) => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }
    
    // جلب أحدث الطلبات
    const fetchRecentOrders = async () => {
      try {
        loading.value = true
        
        let query = supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        // إذا كان المستخدم مندوباً، اعرض طلباته فقط
        if (user.value.role === 'representative') {
          query = query.eq('sales_rep_id', user.value.id)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        recentOrders.value = data
      } catch (error) {
        console.error('خطأ في جلب أحدث الطلبات:', error)
      } finally {
        loading.value = false
      }
    }
    
    // جلب إحصائيات الطلبات
    const fetchOrderStats = async () => {
      try {
        // إجمالي الطلبات
        let totalQuery = supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
        
        // إذا كان المستخدم مندوباً، اعرض إحصائيات طلباته فقط
        if (user.value.role === 'representative') {
          totalQuery = totalQuery.eq('sales_rep_id', user.value.id)
        }
        
        const { count: totalCount, error: totalError } = await totalQuery
        
        if (totalError) throw totalError
        
        stats.value.totalOrders = totalCount || 0
        
        // الطلبات المكتملة
        let completedQuery = supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'delivered')
        
        if (user.value.role === 'representative') {
          completedQuery = completedQuery.eq('sales_rep_id', user.value.id)
        }
        
        const { count: completedCount, error: completedError } = await completedQuery
        
        if (completedError) throw completedError
        
        stats.value.completedOrders = completedCount || 0
        
        // الطلبات الجديدة
        let newQuery = supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')
        
        if (user.value.role === 'representative') {
          newQuery = newQuery.eq('sales_rep_id', user.value.id)
        }
        
        const { count: newCount, error: newError } = await newQuery
        
        if (newError) throw newError
        
        stats.value.newOrders = newCount || 0
        
        // إجمالي المبيعات
        let salesQuery = supabase
          .from('orders')
          .select('total')
          .eq('status', 'delivered')
        
        if (user.value.role === 'representative') {
          salesQuery = salesQuery.eq('sales_rep_id', user.value.id)
        }
        
        const { data: salesData, error: salesError } = await salesQuery
        
        if (salesError) throw salesError
        
        stats.value.totalSales = salesData.reduce((sum, order) => sum + order.total, 0)
      } catch (error) {
        console.error('خطأ في جلب إحصائيات الطلبات:', error)
      }
    }
    
    onMounted(() => {
      document.title = 'لوحة التحكم - نظام إدارة الطلبات'
      fetchRecentOrders()
      fetchOrderStats()
    })
    
    return {
      user,
      loading,
      recentOrders,
      stats,
      isAdmin,
      toggleSidebar,
      canEditOrder,
      getStatusText,
      getStatusClass,
      truncateText,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية */
</style>
