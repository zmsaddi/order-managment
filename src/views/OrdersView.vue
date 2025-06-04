<template>
  <div>
    <!-- عنوان الصفحة وزر الإضافة -->
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
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('id')">
                رقم الطلب
                <span v-if="sortField === 'id'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('customer_name')">
                العميل
                <span v-if="sortField === 'customer_name'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('total')">
                المبلغ
                <span v-if="sortField === 'total'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                الحالة
                <span v-if="sortField === 'status'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('created_at')">
                التاريخ
                <span v-if="sortField === 'created_at'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">#{{ order.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ order.customer_name }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(order.total) }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getOrderStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getOrderStatusText(order.status) }}
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
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusClass, convertToEnglishNumbers } from '@/utils/formatters'

export default {
  name: 'OrdersView',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const orders = ref([])
    const searchQuery = ref('')
    const statusFilter = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    const sortField = ref('created_at')
    const sortDirection = ref('desc')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // متغيرات نافذة الحذف
    const showDeleteModal = ref(false)
    const orderToDelete = ref(null)
    const deleting = ref(false)
    
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
      
      // ترتيب النتائج
      result.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]
        
        // تحويل التواريخ
        if (sortField.value === 'created_at') {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }
        
        // تحويل الأرقام
        if (sortField.value === 'total' || sortField.value === 'id') {
          aValue = parseFloat(aValue) || 0
          bValue = parseFloat(bValue) || 0
        }
        
        if (sortDirection.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      return result
    })
    
    // جلب الطلبات
    const fetchOrders = async () => {
      try {
        loading.value = true
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        orders.value = data || []
      } catch (error) {
        console.error('خطأ في جلب الطلبات:', error)
        orders.value = []
      } finally {
        loading.value = false
      }
    }
    
    // تغيير حقل الفرز
    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }
    
    // إعادة تعيين الفلاتر
    const resetFilters = () => {
      searchQuery.value = ''
      statusFilter.value = ''
      dateFrom.value = ''
      dateTo.value = ''
    }
    
    // مشاركة عبر واتساب - تنسيق محسن وشامل
    const shareOnWhatsApp = (order) => {
      if (!order) return
      
      // استخراج معلومات المنتجات من product_description (JSON)
      let productsText = ''
      try {
        if (order.product_description) {
          // محاولة تحليل JSON
          const products = JSON.parse(order.product_description)
          if (Array.isArray(products) && products.length > 0) {
            productsText = products.map((product, index) => 
              `${index + 1}. ${product.name} - الكمية: ${convertToEnglishNumbers(product.quantity.toString())} - السعر: €${convertToEnglishNumbers(product.price.toString())}`
            ).join('\n')
          } else {
            // إذا لم يكن JSON، استخدم النص كما هو
            productsText = `1. ${order.product_description}`
          }
        }
      } catch (error) {
        // إذا فشل تحليل JSON، استخدم النص كما هو
        productsText = `1. ${order.product_description || 'منتج غير محدد'}`
      }
      
      // استخراج الكمية الإجمالية من الملاحظات
      let totalQuantityText = ''
      if (order.notes && order.notes.includes('الكمية الإجمالية:')) {
        const match = order.notes.match(/الكمية الإجمالية:\s*(\d+)/)
        if (match && match[1]) {
          totalQuantityText = `\n\n📊 الكمية الإجمالية: ${convertToEnglishNumbers(match[1])} قطعة`
        }
      }
      
      // رسالة واضحة ومنظمة
      const message = `🛍️ *تفاصيل الطلب رقم ${order.id}*

👤 *معلومات العميل:*
الاسم: ${order.customer_name}
الهاتف: ${order.customer_phone || 'غير متوفر'}
العنوان: ${order.customer_address || 'غير متوفر'}

📦 *المنتجات المطلوبة:*
${productsText}${totalQuantityText}

💰 *تفاصيل الفاتورة:*
المجموع الفرعي: ${formatCurrency(order.subtotal)}
الضريبة (${convertToEnglishNumbers((order.tax_rate || 15).toString())}%): ${formatCurrency(order.tax_amount)}
الإجمالي النهائي: ${formatCurrency(order.total)}

📋 *حالة الطلب:* ${getOrderStatusText(order.status)}

---
تم إنشاء هذا الطلب من نظام إدارة الطلبات`
      
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')
    }
    
    // إنشاء فاتورة
    const generateInvoice = (order) => {
      // هنا يمكن إضافة منطق إنشاء الفاتورة
      console.log('إنشاء فاتورة للطلب:', order.id)
    }
    
    // التحقق من إمكانية حذف الطلب
    const canDeleteOrder = (order) => {
      return isAdmin.value && order.status === 'new'
    }
    
    // تأكيد حذف الطلب
    const confirmDeleteOrder = (order) => {
      orderToDelete.value = order
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة الحذف
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
        
        // إزالة الطلب من القائمة
        orders.value = orders.value.filter(order => order.id !== orderToDelete.value.id)
        
        closeDeleteModal()
      } catch (error) {
        console.error('خطأ في حذف الطلب:', error)
        alert('حدث خطأ أثناء حذف الطلب')
      } finally {
        deleting.value = false
      }
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      loading,
      orders,
      filteredOrders,
      searchQuery,
      statusFilter,
      dateFrom,
      dateTo,
      sortField,
      sortDirection,
      showDeleteModal,
      orderToDelete,
      deleting,
      isAdmin,
      fetchOrders,
      sortBy,
      resetFilters,
      shareOnWhatsApp,
      generateInvoice,
      canDeleteOrder,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder,
      formatCurrency,
      formatDate,
      getOrderStatusText,
      getOrderStatusClass
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية إذا لزم الأمر */
</style>

