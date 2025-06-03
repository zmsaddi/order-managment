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
              <h2 class="text-xl font-semibold text-gray-800">الطلبات</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
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
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">إدارة الطلبات</h1>
            <router-link to="/orders/create" class="btn btn-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              إضافة طلب جديد
            </router-link>
          </div>
          
          <!-- فلاتر البحث -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label for="search" class="form-label">بحث</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="search" 
                    v-model="searchQuery" 
                    placeholder="اسم العميل، رقم الطلب..." 
                    class="form-input pr-8"
                  />
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="status-filter" class="form-label">الحالة</label>
                <select id="status-filter" v-model="statusFilter" class="form-input">
                  <option value="">جميع الحالات</option>
                  <option value="new">جديد</option>
                  <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>
              
              <div>
                <label for="date-from" class="form-label">من تاريخ</label>
                <input 
                  type="date" 
                  id="date-from" 
                  v-model="dateFrom" 
                  class="form-input"
                />
              </div>
              
              <div>
                <label for="date-to" class="form-label">إلى تاريخ</label>
                <input 
                  type="date" 
                  id="date-to" 
                  v-model="dateTo" 
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="flex justify-end mt-4">
              <button @click="resetFilters" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 ml-2">
                إعادة تعيين
              </button>
              <button @click="fetchOrders" class="btn btn-primary">
                تطبيق الفلتر
              </button>
            </div>
          </div>
          
          <!-- جدول الطلبات -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div v-if="loading" class="text-center py-8">
              <p>جاري تحميل البيانات...</p>
            </div>
            
            <div v-else-if="filteredOrders.length === 0" class="text-center py-8">
              <p v-if="searchQuery || statusFilter || dateFrom || dateTo">لا توجد نتائج مطابقة للبحث</p>
              <p v-else>لا توجد طلبات</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">#{{ order.id }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ order.customer_name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ order.total }} ر.س</td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(order.created_at) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      <div class="flex space-x-2 space-x-reverse">
                        <router-link 
                          :to="`/orders/${order.id}`" 
                          class="text-sky-600 hover:text-sky-800"
                          title="عرض التفاصيل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                          </svg>
                        </router-link>
                        
                        <button 
                          @click="shareOnWhatsApp(order)" 
                          class="text-green-600 hover:text-green-800"
                          title="مشاركة عبر واتساب"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </button>
                        
                        <button 
                          @click="generateInvoice(order)" 
                          class="text-purple-600 hover:text-purple-800"
                          title="إنشاء فاتورة"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        
                        <button 
                          v-if="canDeleteOrder(order)" 
                          @click="confirmDeleteOrder(order)" 
                          class="text-red-600 hover:text-red-800"
                          title="حذف"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    
    <!-- نافذة تأكيد الحذف -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeDeleteModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 class="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    هل أنت متأكد من رغبتك في حذف الطلب رقم "{{ orderToDelete?.id }}"؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="btn btn-danger w-full sm:w-auto sm:mr-3" 
                @click="deleteOrder"
                :disabled="deleting"
              >
                <span v-if="deleting">جاري الحذف...</span>
                <span v-else>حذف</span>
              </button>
              <button 
                type="button" 
                class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                @click="closeDeleteModal"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import SidebarMenu from '@/components/SidebarMenu.vue'

export default {
  name: 'OrdersView',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter()
    const showMobileSidebar = ref(false)
    const loading = ref(true)
    const orders = ref([])
    const searchQuery = ref('')
    const statusFilter = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // تصفية الطلبات حسب البحث والفلاتر
    const filteredOrders = computed(() => {
      let result = orders.value
      
      // تصفية حسب البحث
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order => 
          order.customer_name.toLowerCase().includes(query) || 
          order.id.toString().includes(query)
        )
      }
      
      // تصفية حسب الحالة
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }
      
      // تصفية حسب التاريخ (من)
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value)
        result = result.filter(order => new Date(order.created_at) >= fromDate)
      }
      
      // تصفية حسب التاريخ (إلى)
      if (dateTo.value) {
        const toDate = new Date(dateTo.value)
        toDate.setHours(23, 59, 59, 999) // نهاية اليوم
        result = result.filter(order => new Date(order.created_at) <= toDate)
      }
      
      return result
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
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
    
    // تنسيق التاريخ
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
    
    // إعادة تعيين الفلاتر
    const resetFilters = () => {
      searchQuery.value = ''
      statusFilter.value = ''
      dateFrom.value = ''
      dateTo.value = ''
      fetchOrders()
    }
    
    // جلب الطلبات
    const fetchOrders = async () => {
      try {
        loading.value = true
        
        let query = supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        
        // إذا كان المستخدم مندوباً، فقط اعرض طلباته
        if (user.value.role === 'representative') {
          query = query.eq('sales_rep_id', user.value.id)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        orders.value = data || []
      } catch (error) {
        console.error('خطأ في جلب الطلبات:', error)
      } finally {
        loading.value = false
      }
    }
    
    // مشاركة الطلب عبر واتساب
    const shareOnWhatsApp = (order) => {
      const message = `
طلب رقم: ${order.id}
العميل: ${order.customer_name}
الهاتف: ${order.customer_phone || 'غير متوفر'}
العنوان: ${order.customer_address || 'غير متوفر'}
المنتج: ${order.product_description}
الكمية: ${order.quantity}
السعر: ${order.unit_price} ر.س
الإجمالي: ${order.total} ر.س
الحالة: ${getStatusText(order.status)}
      `.trim()
      
      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
    }
    
    // إنشاء فاتورة للطلب
    const generateInvoice = (order) => {
      router.push(`/orders/${order.id}?invoice=true`)
    }
    
    // متغيرات نافذة تأكيد الحذف
    const showDeleteModal = ref(false)
    const orderToDelete = ref(null)
    const deleting = ref(false)
    
    // التحقق من إمكانية حذف الطلب
    const canDeleteOrder = (order) => {
      // فقط المدراء يمكنهم حذف الطلبات
      return isAdmin.value
    }
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteOrder = (order) => {
      orderToDelete.value = order
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      orderToDelete.value = null
    }
    
    // حذف الطلب
    const deleteOrder = async () => {
      if (!orderToDelete.value) return
      
      try {
        deleting.value = true
        
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderToDelete.value.id)
        
        if (error) throw error
        
        // إعادة تحميل الطلبات
        await fetchOrders()
        
        // إغلاق النافذة
        closeDeleteModal()
      } catch (error) {
        console.error('خطأ في حذف الطلب:', error)
        alert(`خطأ في حذف الطلب: ${error.message}`)
      } finally {
        deleting.value = false
      }
    }
    
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      user,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      logout,
      loading,
      orders,
      searchQuery,
      statusFilter,
      dateFrom,
      dateTo,
      filteredOrders,
      getStatusText,
      getStatusClass,
      formatDate,
      resetFilters,
      fetchOrders,
      shareOnWhatsApp,
      generateInvoice,
      
      // حذف طلب
      showDeleteModal,
      orderToDelete,
      deleting,
      canDeleteOrder,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder
    }
  }
}
</script>
