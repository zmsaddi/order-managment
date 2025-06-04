<template>
  <div>
    <!-- … -->
    <!-- تفاصيل المنتجات -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">تفاصيل المنتجات</h2>
      
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
            <!-- إذا وُجدت منتجات في الجدول المنفصل -->
            <tr v-if="order.products && order.products.length"
                v-for="(product, index) in order.products" :key="product.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">
                <div class="font-medium">{{ product.name || 'اسم المنتج غير متوفر' }}</div>
                <div v-if="product.description" class="text-sm text-gray-600 mt-1">{{ product.description }}</div>
                <div v-if="product.notes" class="text-sm text-yellow-600 mt-1 italic">{{ product.notes }}</div>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center font-medium">
                {{ convertToEnglishNumbers((product.quantity || 1).toString()) }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center font-medium text-blue-600">
                {{ formatCurrency(product.unit_price || 0) }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ formatCurrency(product.subtotal || 0) }}
              </td>
-             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 15).toString()) }}%</td>
+             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers(order.tax_rate.toString()) }}%</td>
-             <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency((product.subtotal || 0) * (order.tax_rate || 15) / 100) }}</td>
+             <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency((product.subtotal || 0) * order.tax_rate / 100) }}</td>
-             <td class="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{{ formatCurrency((product.subtotal || 0) * (1 + (order.tax_rate || 15) / 100)) }}</td>
+             <td class="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{{ formatCurrency((product.subtotal || 0) * (1 + order.tax_rate / 100)) }}</td>
            </tr>

            <!-- إذا لم توجد منتجات -->
            <tr v-else class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">
                <div class="font-medium">{{ order.product_description || 'وصف المنتج غير متوفر' }}</div>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center font-medium">{{ convertToEnglishNumbers((order.quantity || 1).toString()) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center font-medium text-blue-600">{{ formatCurrency(calculateUnitPrice(order)) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.subtotal || 0) }}</td>
-             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 15).toString()) }}%</td>
+             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers(order.tax_rate.toString()) }}%</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.tax_amount || 0) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{{ formatCurrency(order.total || 0) }}</td>
            </tr>
          </tbody>

          <!-- صف الإجمالي -->
          <tfoot>
            <tr class="bg-sky-50 font-semibold">
              <td colspan="3" class="border border-gray-300 px-4 py-2 text-center">الإجمالي</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.subtotal || 0) }}</td>
-             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers((order.tax_rate || 15).toString()) }}%</td>
+             <td class="border border-gray-300 px-4 py-2 text-center">{{ convertToEnglishNumbers(order.tax_rate.toString()) }}%</td>
              <td class="border border-gray-300 px-4 py-2 text-center">{{ formatCurrency(order.tax_amount || 0) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center text-sky-700 font-bold">{{ formatCurrency(order.total || 0) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <!-- … بقية القالب … -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import {
  formatCurrency,
  formatDate,
  getOrderStatusText,
  getOrderStatusClass,
  convertToEnglishNumbers,
  shareOrderOnWhatsApp,
  parseEnglishNumber
} from '@/utils/formatters'
import {
  deleteOrderById,
  generateOrderInvoice,
  canEditOrder,
  canDeleteOrder,
  fetchOrderWithProducts
} from '@/utils/orderUtils'

export default {
  name: 'OrderDetailsView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 1) استخراج rawId وتحويله إلى رقم
    const rawId   = route.params.id
    const orderId = Number(rawId)

    // 2) التحقق من صلاحية المعرّف
    if (!Number.isInteger(orderId) || orderId <= 0) {
      alert('معرّف الطلب غير صالح')
      router.push('/orders')
      return { /* تجنب أي خطأ إضافي */ }
    }

    const loading = ref(false)
    const order   = ref(null)
    const salesRep = ref(null)
    const newStatus = ref('')
    const showDeleteModal = ref(false)
    const deleting = ref(false)

    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    const isAdmin = computed(() => ['admin', 'sales_manager'].includes(user.value.role))
    const canEditOrderComputed = computed(() => canEditOrder(order.value, user.value))
    const canDeleteOrderComputed = computed(() => canDeleteOrder(order.value, user.value))

    const canChangeStatus = computed(() => {
      if (!order.value) return false
      if (isAdmin.value) return true
      return user.value.id === order.value.sales_rep_id
    })

    const calculateUnitPrice = (orderData) => {
      if (!orderData) return 0
      if (orderData.notes && orderData.notes.includes('سعر الوحدة المتوسط:')) {
        const match = orderData.notes.match(/سعر الوحدة المتوسط:\s*€([\d.]+)/)
        if (match && match[1]) {
          return parseFloat(match[1])
        }
      }
      let totalQuantity = 1
      if (orderData.notes && orderData.notes.includes('الكمية الإجمالية:')) {
        const match = orderData.notes.match(/الكمية الإجمالية:\s*(\d+)/)
        if (match && match[1]) {
          totalQuantity = parseInt(match[1])
        }
      }
      const subtotal = parseEnglishNumber(orderData.subtotal) || 0
      if (subtotal > 0 && totalQuantity > 0) {
        return Math.round((subtotal / totalQuantity) * 100) / 100
      }
      return 0
    }

    const fetchOrder = async () => {
      loading.value = true
      try {
        const orderData = await fetchOrderWithProducts(orderId)
        if (!orderData) throw new Error('لم يتم العثور على البيانات')
        order.value = orderData
        newStatus.value = orderData.status

        if (orderData.sales_rep_id) {
          const { data: userData, error: userErr } = await supabase
            .from('users')
            .select('name, email, phone')
            .eq('id', orderData.sales_rep_id)
            .single()
          if (!userErr && userData) salesRep.value = userData
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
        order.value = null
      } finally {
        loading.value = false
      }
    }

    const updateOrderStatus = async () => {
      if (!order.value || newStatus.value === order.value.status) return
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus.value })
          .eq('id', order.value.id)
        if (error) throw error
        order.value.status = newStatus.value
        alert('تم تحديث حالة الطلب بنجاح')
      } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error)
        alert('حدث خطأ أثناء تحديث حالة الطلب')
        newStatus.value = order.value.status
      }
    }

    const shareOnWhatsApp = () => {
      shareOrderOnWhatsApp(order.value)
    }

    const generateInvoice = async () => {
      await generateOrderInvoice(order.value)
    }

    const confirmDeleteOrder = () => {
      showDeleteModal.value = true
    }
    const closeDeleteModal = () => {
      showDeleteModal.value = false
    }

    const deleteOrder = async () => {
      deleting.value = true
      const success = await deleteOrderById(
        order.value.id,
        () => {
          router.push('/orders')
        },
        (err) => {
          console.error('خطأ في حذف الطلب:', err)
          alert('حدث خطأ أثناء حذف الطلب')
        }
      )
      deleting.value = false
      showDeleteModal.value = false
    }

    onMounted(() => {
      fetchOrder()
    })

    return {
      order,
      salesRep,
      loading,
      newStatus,
      showDeleteModal,
      deleting,
      canEditOrder: canEditOrderComputed,
      canDeleteOrder: canDeleteOrderComputed,
      canChangeStatus,
      calculateUnitPrice,
      getStatusText: getOrderStatusText,
      getStatusClass: getOrderStatusClass,
      updateOrderStatus,
      shareOnWhatsApp,
      generateInvoice,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder,
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
