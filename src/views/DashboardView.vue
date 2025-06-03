<template>
  <div class="min-h-screen bg-gray-50">
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
              <h2 class="text-xl font-semibold text-gray-800">لوحة التحكم</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name ? user.name.charAt(0) : 'U' }}
              </div>
            </div>
          </div>
        </header>
        
        <!-- القائمة الجانبية للجوال -->
        <div v-if="showMobileSidebar" class="fixed inset-0 z-20 md:hidden">
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
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">إجمالي الطلبات</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.totalOrders }}</h3>
                </div>
                <div class="bg-sky-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">طلبات جديدة</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.newOrders }}</h3>
                </div>
                <div class="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">طلبات مكتملة</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.completedOrders }}</h3>
                </div>
                <div class="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">إجمالي المبيعات</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.totalSales) }}</h3>
                </div>
                <div class="bg-purple-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- الطلبات حسب الحالة -->
            <div class="card bg-white rounded-lg shadow-sm">
              <div class="border-b border-gray-200 p-4">
                <h2 class="text-lg font-semibold text-gray-800">الطلبات حسب الحالة</h2>
              </div>
              <div class="p-4">
                <div v-if="loading" class="text-center py-4">
                  <p>جاري تحميل البيانات...</p>
                </div>
                <div v-else>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- الطلبات الجديدة -->
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-yellow-800">طلبات جديدة</h3>
                        <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">{{ ordersByStatus.new ? ordersByStatus.new.length : 0 }}</span>
                      </div>
                      <div v-if="!ordersByStatus.new || ordersByStatus.new.length === 0" class="text-center py-2 text-sm text-gray-500">
                        لا توجد طلبات
                      </div>
                      <div v-else class="space-y-2">
                        <div v-for="order in ordersByStatus.new.slice(0, 3)" :key="order.id" class="bg-white p-2 rounded border border-yellow-200 text-sm">
                          <div class="flex justify-between">
                            <router-link :to="`/orders/${order.id}`" class="text-sky-600 hover:text-sky-900 font-medium">
                              #{{ String(order.id).substring(0, 8) }}
                            </router-link>
                            <span>{{ formatCurrency(order.total) }}</span>
                          </div>
                          <div class="text-gray-500 text-xs mt-1">{{ order.customer_name }}</div>
                        </div>
                        <div v-if="ordersByStatus.new && ordersByStatus.new.length > 3" class="text-center text-xs text-sky-600 hover:text-sky-800">
                          <router-link :to="{ path: '/orders', query: { status: 'new' } }">
                            عرض {{ ordersByStatus.new.length - 3 }} طلبات أخرى
                          </router-link>
                        </div>
                      </div>
                    </div>
                    
                    <!-- الطلبات المكتملة بانتظار التسليم -->
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-blue-800">بانتظار التسليم</h3>
                        <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">{{ ordersByStatus.completed_pending_delivery ? ordersByStatus.completed_pending_delivery.length : 0 }}</span>
                      </div>
                      <div v-if="!ordersByStatus.completed_pending_delivery || ordersByStatus.completed_pending_delivery.length === 0" class="text-center py-2 text-sm text-gray-500">
                        لا توجد طلبات
                      </div>
                      <div v-else class="space-y-2">
                        <div v-for="order in ordersByStatus.completed_pending_delivery.slice(0, 3)" :key="order.id" class="bg-white p-2 rounded border border-blue-200 text-sm">
                          <div class="flex justify-between">
                            <router-link :to="`/orders/${order.id}`" class="text-sky-600 hover:text-sky-900 font-medium">
                              #{{ String(order.id).substring(0, 8) }}
                            </router-link>
                            <span>{{ formatCurrency(order.total) }}</span>
                          </div>
                          <div class="text-gray-500 text-xs mt-1">{{ order.customer_name }}</div>
                        </div>
                        <div v-if="ordersByStatus.completed_pending_delivery && ordersByStatus.completed_pending_delivery.length > 3" class="text-center text-xs text-sky-600 hover:text-sky-800">
                          <router-link :to="{ path: '/orders', query: { status: 'completed_pending_delivery' } }">
                            عرض {{ ordersByStatus.completed_pending_delivery.length - 3 }} طلبات أخرى
                          </router-link>
                        </div>
                      </div>
                    </div>
                    
                    <!-- الطلبات المسلمة -->
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-green-800">تم التسليم</h3>
                        <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">{{ ordersByStatus.delivered ? ordersByStatus.delivered.length : 0 }}</span>
                      </div>
                      <div v-if="!ordersByStatus.delivered || ordersByStatus.delivered.length === 0" class="text-center py-2 text-sm text-gray-500">
                        لا توجد طلبات
                      </div>
                      <div v-else class="space-y-2">
                        <div v-for="order in ordersByStatus.delivered.slice(0, 3)" :key="order.id" class="bg-white p-2 rounded border border-green-200 text-sm">
                          <div class="flex justify-between">
                            <router-link :to="`/orders/${order.id}`" class="text-sky-600 hover:text-sky-900 font-medium">
                              #{{ String(order.id).substring(0, 8) }}
                            </router-link>
                            <span>{{ formatCurrency(order.total) }}</span>
                          </div>
                          <div class="text-gray-500 text-xs mt-1">{{ order.customer_name }}</div>
                        </div>
                        <div v-if="ordersByStatus.delivered && ordersByStatus.delivered.length > 3" class="text-center text-xs text-sky-600 hover:text-sky-800">
                          <router-link :to="{ path: '/orders', query: { status: 'delivered' } }">
                            عرض {{ ordersByStatus.delivered.length - 3 }} طلبات أخرى
                          </router-link>
                        </div>
                      </div>
                    </div>
                    
                    <!-- الطلبات الملغاة -->
                    <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-red-800">ملغاة</h3>
                        <span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">{{ ordersByStatus.cancelled ? ordersByStatus.cancelled.length : 0 }}</span>
                      </div>
                      <div v-if="!ordersByStatus.cancelled || ordersByStatus.cancelled.length === 0" class="text-center py-2 text-sm text-gray-500">
                        لا توجد طلبات
                      </div>
                      <div v-else class="space-y-2">
                        <div v-for="order in ordersByStatus.cancelled.slice(0, 3)" :key="order.id" class="bg-white p-2 rounded border border-red-200 text-sm">
                          <div class="flex justify-between">
                            <router-link :to="`/orders/${order.id}`" class="text-sky-600 hover:text-sky-900 font-medium">
                              #{{ String(order.id).substring(0, 8) }}
                            </router-link>
                            <span>{{ formatCurrency(order.total) }}</span>
                          </div>
                          <div class="text-gray-500 text-xs mt-1">{{ order.customer_name }}</div>
                        </div>
                        <div v-if="ordersByStatus.cancelled && ordersByStatus.cancelled.length > 3" class="text-center text-xs text-sky-600 hover:text-sky-800">
                          <router-link :to="{ path: '/orders', query: { status: 'cancelled' } }">
                            عرض {{ ordersByStatus.cancelled.length - 3 }} طلبات أخرى
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- أداء المبيعات -->
            <div class="card bg-white rounded-lg shadow-sm">
              <div class="border-b border-gray-200 p-4">
                <h2 class="text-lg font-semibold text-gray-800">أداء المبيعات</h2>
              </div>
              <div class="p-4">
                <div v-if="loading" class="text-center py-4">
                  <p>جاري تحميل البيانات...</p>
                </div>
                <div v-else>
                  <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">المبيعات الشهرية</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.monthlySales) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">متوسط قيمة الطلب</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.averageOrderValue) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">أعلى قيمة طلب</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.highestOrderValue) }}</p>
                  </div>
                  
                  <div class="mt-6">
                    <h3 class="text-sm font-medium text-gray-500 mb-2">توزيع حالات الطلبات</h3>
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: `${stats.newOrdersPercentage}%` }"></div>
                      </div>
                      <span class="text-sm text-gray-500 mr-2">{{ stats.newOrdersPercentage }}%</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">نسبة الطلبات الجديدة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import { useRouter } from 'vue-router'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default {
  name: 'DashboardView',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter()
    const showMobileSidebar = ref(false)
    const loading = ref(true)
    const recentOrders = ref([])
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // إحصائيات لوحة التحكم
    const stats = ref({
      totalOrders: 0,
      newOrders: 0,
      completedOrders: 0,
      totalSales: 0,
      monthlySales: 0,
      averageOrderValue: 0,
      highestOrderValue: 0,
      newOrdersPercentage: 0
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // الحصول على نص حالة الطلب
    const getStatusText = (status) => {
      const statusMap = {
        'new': 'جديد',
        'completed_pending_delivery': 'مكتمل بانتظار التسليم',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغى'
      }
      return statusMap[status] || status
    }
    
    // الحصول على فئة CSS لحالة الطلب
    const getStatusClass = (status) => {
      const statusClassMap = {
        'new': 'bg-yellow-100 text-yellow-800',
        'completed_pending_delivery': 'bg-blue-100 text-blue-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return statusClassMap[status] || 'bg-gray-100 text-gray-800'
    }
    
    // متغيرات الطلبات حسب الحالة
    const ordersByStatus = ref({
      new: [],
      completed_pending_delivery: [],
      delivered: [],
      cancelled: []
    })
    
    // جلب الطلبات الأخيرة
    const fetchRecentOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (error) throw error
        
        recentOrders.value = data || []
        
        // تحديث الطلبات حسب الحالة
        await fetchOrdersByStatus()
      } catch (error) {
        console.error('خطأ في جلب الطلبات الأخيرة:', error)
        recentOrders.value = []
      }
    }
    
    // جلب الطلبات حسب الحالة
    const fetchOrdersByStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        // تصنيف الطلبات حسب الحالة
        ordersByStatus.value = {
          new: data.filter(order => order.status === 'new') || [],
          completed_pending_delivery: data.filter(order => order.status === 'completed_pending_delivery') || [],
          delivered: data.filter(order => order.status === 'delivered') || [],
          cancelled: data.filter(order => order.status === 'cancelled') || []
        }
      } catch (error) {
        console.error('خطأ في جلب الطلبات حسب الحالة:', error)
        // تهيئة القيم الافتراضية في حالة الخطأ
        ordersByStatus.value = {
          new: [],
          completed_pending_delivery: [],
          delivered: [],
          cancelled: []
        }
      }
    }
    
    // جلب إحصائيات لوحة التحكم
    const fetchStats = async () => {
      try {
        // إجمالي الطلبات
        const { count: totalOrders, error: totalError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
        
        if (totalError) throw totalError
        
        // الطلبات الجديدة
        const { count: newOrders, error: newError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new')
        
        if (newError) throw newError
        
        // الطلبات المكتملة
        const { count: completedOrders, error: completedError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .in('status', ['completed_pending_delivery', 'delivered'])
        
        if (completedError) throw completedError
        
        // إجمالي المبيعات
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('total')
        
        if (salesError) throw salesError
        
        const totalSales = salesData.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
        
        // المبيعات الشهرية
        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
        
        const { data: monthlySalesData, error: monthlySalesError } = await supabase
          .from('orders')
          .select('total')
          .gte('created_at', firstDayOfMonth)
        
        if (monthlySalesError) throw monthlySalesError
        
        const monthlySales = monthlySalesData.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
        
        // متوسط قيمة الطلب
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
        
        // أعلى قيمة طلب
        const highestOrderValue = salesData.length > 0 ? Math.max(...salesData.map(order => parseFloat(order.total || 0))) : 0
        
        // نسبة الطلبات الجديدة
        const newOrdersPercentage = totalOrders > 0 ? Math.round((newOrders / totalOrders) * 100) : 0
        
        stats.value = {
          totalOrders,
          newOrders,
          completedOrders,
          totalSales,
          monthlySales,
          averageOrderValue,
          highestOrderValue,
          newOrdersPercentage
        }
      } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error)
        // تهيئة القيم الافتراضية في حالة الخطأ
        stats.value = {
          totalOrders: 0,
          newOrders: 0,
          completedOrders: 0,
          totalSales: 0,
          monthlySales: 0,
          averageOrderValue: 0,
          highestOrderValue: 0,
          newOrdersPercentage: 0
        }
      }
    }
    
    // تسجيل الخروج
    const logout = async () => {
      try {
        await authService.logout()
        localStorage.removeItem('user')
        router.push('/login')
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
    
    // تهيئة الصفحة
    onMounted(async () => {
      loading.value = true
      
      try {
        await Promise.all([
          fetchRecentOrders(),
          fetchStats()
        ])
      } catch (error) {
        console.error('خطأ في تهيئة الصفحة:', error)
      } finally {
        loading.value = false
      }
    })
    
    return {
      user,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      loading,
      recentOrders,
      stats,
      ordersByStatus,
      getStatusText,
      getStatusClass,
      logout,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية إذا لزم الأمر */
</style>
