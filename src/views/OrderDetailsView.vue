<template><div>
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
          
          <div v-else-if="order === null && !loading" class="text-center py-8">
            <div class="text-red-500 mb-4">
              <svg class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على الطلب</h3>
            <p class="text-gray-600 mb-4">الطلب المطلوب غير موجود أو تم حذفه</p>
            <router-link to="/orders" class="btn btn-primary">العودة إلى الطلبات</router-link>
          </div>
          
          <div v-else>
            <!-- رأس الصفحة -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">الطلب رقم #{{ order.id }}</h1>
                <p class="text-gray-600">{{ formatDate(order.created_at) }}</p>
              </div>
              
              <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button 
                  @click="shareOnWhatsApp" 
                  class="btn bg-green-600 hover:bg-green-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  مشاركة عبر واتساب
                </button>
                
                <button 
                  @click="generateInvoice" 
                  class="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
                  </svg>
                  إنشاء فاتورة
                </button>
                
                <router-link 
                  v-if="canEditOrder" 
                  :to="`/orders/edit/${order.id}`" 
                  class="btn bg-sky-600 hover:bg-sky-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  تعديل الطلب
                </router-link>
                
                <button 
                  v-if="canDeleteOrder" 
                  @click="confirmDeleteOrder" 
                  class="btn bg-red-600 hover:bg-red-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  حذف الطلب
                </button>
              </div>
            </div>
            
            <!-- حالة الطلب -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div class="flex items-center mb-4 md:mb-0">
                  <span class="text-gray-700 ml-2">حالة الطلب:</span>
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 text-sm rounded-full">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                
                <div v-if="canChangeStatus" class="flex items-center">
                  <span class="text-gray-700 ml-2">تغيير الحالة:</span>
                  <select 
                    v-model="newStatus" 
                    class="form-input w-auto"
                    @change="updateOrderStatus"
                  >
                    <option value="new">جديد</option>
                    <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغى</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- تفاصيل الطلب -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- بيانات العميل -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات العميل</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600">الاسم:</span>
                    <span class="font-medium block">{{ order.customer_name }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">رقم الهاتف:</span>
                    <span class="font-medium block">{{ order.customer_phone || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">العنوان:</span>
                    <span class="font-medium block">{{ order.customer_address || 'غير متوفر' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- بيانات المندوب -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات المندوب</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600">الاسم:</span>
                    <span class="font-medium block">{{ salesRep?.name || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">البريد الإلكتروني:</span>
                    <span class="font-medium block">{{ salesRep?.email || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">رقم الهاتف:</span>
                    <span class="font-medium block">{{ salesRep?.phone || 'غير متوفر' }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- تفاصيل المنتجات -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">تفاصيل المنتجات</h2>
              
              <!-- جدول المنتجات -->
              <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-4 py-2 text-center">وصف المنتج</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">الكمية</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">سعر الوحدة</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">المجموع الفرعي</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">نسبة الضريبة</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">قيمة الضريبة</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- عرض المنتجات من الجدول المنفصل -->
                    <tr v-if="order.products && order.products.length > 0" v-for="(product, index) in order.products" :key="product.id" class="hover:bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">
                        <div class="font-medium">{{ product.name || 'اسم المنتج غير متوفر' }}</div>
                        <div v-if="product.description" class="text-sm text-gray-600 mt-1">{{ product.description }}</div>
                        <div v-if="product.notes" class="text-sm text-yellow-600 mt-1 italic">{{ product.notes }}</div>
                      </td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-medium">{{ convertToEnglishNumbers((product.quantity || 1).toString()) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-medium text-blue-600">{{ formatCurrency(product.unit_price || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(product.subtotal || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 0).toString()) }}%</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency((product.subtotal || 0) * (order.tax_rate || 0) / 100) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{{ formatCurrency((product.subtotal || 0) * (1 + (order.tax_rate || 0) / 100)) }}</td>
                    </tr>
                    
                    <!-- عرض بيانات المنتج من الحقول الأساسية (للطلبات القديمة) -->
                    <tr v-else class="hover:bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">
                        <div class="font-medium">{{ order.product_description || order.description || 'وصف المنتج غير متوفر' }}</div>
                        <div v-if="order.notes" class="text-sm text-yellow-600 mt-1 italic">{{ order.notes }}</div>
                      </td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-medium">{{ convertToEnglishNumbers((order.quantity || 1).toString()) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-medium text-blue-600">{{ formatCurrency(calculateUnitPrice(order)) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.subtotal || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 0).toString()) }}%</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.tax_amount || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{{ formatCurrency(order.total || 0) }}</td>
                    </tr>
                  </tbody>
                  
                  <!-- صف الإجمالي -->
                  <tfoot>
                    <tr class="bg-sky-50 font-semibold">
                      <td colspan="3" class="border border-gray-300 px-4 py-2 text-center">الإجمالي</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.subtotal || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 0).toString()) }}%</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.tax_amount || 0) }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center text-sky-700 font-bold">{{ formatCurrency(order.total || 0) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <!-- ملاحظات المنتجات -->
              <div v-if="order.products && order.products.some(product => product.notes)" class="mt-4">
                <h3 class="text-md font-semibold text-gray-700 mb-2">ملاحظات المنتجات:</h3>
                <div v-for="(product, index) in order.products" :key="product.id" class="mb-2">
                  <div v-if="product.notes" class="p-2 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                    <span class="font-medium">{{ product.name || product.description }}:</span>
                    <span class="text-gray-700">{{ product.notes }}</span>
                  </div>
                </div>
              </div>
              
              <!-- ملاحظات الطلب العامة -->
              <div v-if="order.notes" class="mt-4 p-3 bg-gray-50 rounded-md">
                <span class="text-gray-600 font-medium">ملاحظات الطلب:</span>
                <p class="mt-1 text-gray-800">{{ order.notes }}</p>
              </div>
            </div>
            
            <!-- ملخص الطلب -->
            <div class="bg-white rounded-lg shadow-sm p-4">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">ملخص الطلب</h2>
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">المجموع الفرعي:</span>
                  <span class="font-medium">{{ formatCurrency(order.subtotal) }}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">قيمة الضريبة ({{ convertToEnglishNumbers((order.tax_rate || 0).toString()) }}%):</span>
                  <span class="font-medium">{{ formatCurrency(order.tax_amount) }}</span>
                </div>
                <div class="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span class="text-gray-800 font-semibold">الإجمالي:</span>
                  <span class="text-xl font-bold text-sky-700">{{ formatCurrency(order.total) }}</span>
                </div>
              </div>
            </div>
          </div>
</div></template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusClass, convertToEnglishNumbers, shareOrderOnWhatsApp, parseEnglishNumber } from '@/utils/formatters'
import { deleteOrderById, generateOrderInvoice, canEditOrder, canDeleteOrder, fetchOrderWithProducts } from '@/utils/orderUtils'

export default {
  name: 'OrderDetailsView',
  components: {
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const order = ref(null)
    const salesRep = ref(null)
    const newStatus = ref('')
    const showDeleteModal = ref(false)
    const deleting = ref(false)
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // التحقق من إمكانية تعديل الطلب
    const canEditOrderComputed = computed(() => {
      return canEditOrder(order.value, user.value)
    })
    
    // التحقق من إمكانية حذف الطلب
    const canDeleteOrderComputed = computed(() => {
      return canDeleteOrder(order.value, user.value)
    })
    
    // التحقق من إمكانية تغيير حالة الطلب
    const canChangeStatus = computed(() => {
      if (!order.value) return false
      
      // المدراء يمكنهم تغيير حالة أي طلب
      if (isAdmin.value) return true
      
      // المندوب يمكنه تغيير حالة طلباته فقط
      return user.value.id === order.value.sales_rep_id
    })
    
    // حساب سعر الوحدة من البيانات المتاحة
    const calculateUnitPrice = (orderData) => {
      if (!orderData) return 0
      
      // محاولة استخراج سعر الوحدة من الملاحظات
      if (orderData.notes && orderData.notes.includes('سعر الوحدة المتوسط:')) {
        const match = orderData.notes.match(/سعر الوحدة المتوسط:\s*€([\d.]+)/)
        if (match && match[1]) {
          return parseFloat(match[1])
        }
      }
      
      // محاولة استخراج الكمية الإجمالية من الملاحظات
      let totalQuantity = 1
      if (orderData.notes && orderData.notes.includes('الكمية الإجمالية:')) {
        const match = orderData.notes.match(/الكمية الإجمالية:\s*(\d+)/)
        if (match && match[1]) {
          totalQuantity = parseInt(match[1])
        }
      }
      
      // إذا لم نجد المعلومات في الملاحظات، احسب من المجموع الفرعي والكمية
      const subtotal = parseEnglishNumber(orderData.subtotal) || 0
      
      if (subtotal > 0 && totalQuantity > 0) {
        return Math.round((subtotal / totalQuantity) * 100) / 100
      }
      
      return 0
    }
    
    // الحصول على نص حالة الطلب
    const getStatusText = (status) => {
      return getOrderStatusText(status)
    }
    
    // الحصول على فئة CSS لحالة الطلب
    const getStatusClass = (status) => {
      return getOrderStatusClass(status)
    }
    
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      loading.value = true
      
      try {
        // تحويل معرف الطلب إلى رقم صحيح
        const orderId = Number(route.params.id)
        
        if (!orderId || orderId <= 0) {
          throw new Error('معرف الطلب غير صحيح')
        }
        
        // استخدام الدالة الموحدة لجلب بيانات الطلب مع المنتجات
        const orderData = await fetchOrderWithProducts(orderId)
        
        if (!orderData) {
          throw new Error('لم يتم العثور على الطلب')
        }
        
        order.value = orderData
        newStatus.value = orderData.status
        
        // جلب بيانات المندوب
        if (orderData.sales_rep_id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, email, phone')
            .eq('id', orderData.sales_rep_id)
            .single()
          
          if (!userError && userData) {
            salesRep.value = userData
          }
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
        order.value = null
      } finally {
        loading.value = false
      }
    }
    
    // تحديث حالة الطلب
    const updateOrderStatus = async () => {
      if (!order.value || newStatus.value === order.value.status) return
      
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus.value })
          .eq('id', order.value.id)
        
        if (error) throw error
        
        // تحديث حالة الطلب محلياً
        order.value.status = newStatus.value
        
        alert('تم تحديث حالة الطلب بنجاح')
      } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error)
        alert('حدث خطأ أثناء تحديث حالة الطلب')
        
        // إعادة تعيين القيمة إلى الحالة الأصلية
        newStatus.value = order.value.status
      }
    }
    
    // مشاركة الطلب عبر واتساب - استخدام الدالة الموحدة
    const shareOnWhatsApp = () => {
      shareOrderOnWhatsApp(order.value)
    }
    
    // إنشاء فاتورة - استخدام الدالة الموحدة
    const generateInvoice = async () => {
      await generateOrderInvoice(order.value)
    }
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteOrder = () => {
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
    }
    
    // حذف الطلب - استخدام الدالة الموحدة
    const deleteOrder = async () => {
      deleting.value = true
      
      const success = await deleteOrderById(
        order.value.id,
        () => {
          // عند النجاح - الانتقال إلى قائمة الطلبات
          router.push('/orders')
        },
        (error) => {
          // عند الخطأ - إظهار رسالة خطأ مخصصة
          console.error('خطأ في حذف الطلب:', error)
          alert('حدث خطأ أثناء حذف الطلب')
        }
      )
      
      deleting.value = false
      showDeleteModal.value = false
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      user,
      loading,
      order,
      salesRep,
      newStatus,
      canEditOrder: canEditOrderComputed,
      canDeleteOrder: canDeleteOrderComputed,
      canChangeStatus,
      calculateUnitPrice,
      getStatusText,
      getStatusClass,
      updateOrderStatus,
      shareOnWhatsApp,
      generateInvoice,
      showDeleteModal,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder,
      deleting,
      formatCurrency,
      formatDate,
      parseEnglishNumber,
      convertToEnglishNumbers
    }
  }
}
</script>
<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm;
}

.btn {
  @apply inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
</style>
