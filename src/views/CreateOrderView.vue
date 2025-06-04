<template>
  <div>
    <!-- عنوان الصفحة -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إنشاء طلب جديد</h1>
      <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        العودة إلى الطلبات
      </router-link>
    </div>
    
    <!-- نموذج إنشاء الطلب -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <form @submit.prevent="submitOrder">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- بيانات العميل -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">بيانات العميل</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="customer-name" class="form-label">اسم العميل <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="customer-name" 
                  v-model="order.customer_name" 
                  class="form-input"
                  required
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <label for="customer-phone" class="form-label">رقم هاتف العميل <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="customer-phone" 
                  v-model="order.customer_phone" 
                  class="form-input"
                  required
                  placeholder="مثال: 600123456"
                />
              </div>
              <div>
                <label for="customer-address" class="form-label">عنوان العميل <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="customer-address" 
                  v-model="order.customer_address" 
                  class="form-input"
                  required
                  placeholder="أدخل عنوان العميل"
                />
              </div>
            </div>
          </div>

          <!-- تفاصيل المنتج -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">تفاصيل المنتج</h2>
            <div 
              v-for="(item, index) in order.items" 
              :key="index" 
              class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4"
            >
              <input
                type="text"
                v-model="item.name"
                placeholder="اسم المنتج"
                class="form-input md:col-span-2"
                required
              />
              <number-input
                v-model="item.quantity"
                @blur="() => calculateItemTotal(index)"
                placeholder="الكمية"
                class="form-input"
                min="1"
                required
              />
              <number-input
                v-model="item.price"
                @blur="() => calculateItemTotal(index)"
                placeholder="السعر"
                class="form-input"
                min="0"
                step="0.01"
                required
              />
              <button 
                type="button" 
                @click="removeItem(index)" 
                class="text-red-600 hover:text-red-800"
              >
                إزالة
              </button>
            </div>
            <button 
              type="button" 
              @click="addItem" 
              class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              إضافة عنصر جديد
            </button>
          </div>

          <!-- ملخص الأسعار -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">ملخص الأسعار</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="subtotal" class="form-label">المجموع الفرعي</label>
                <input 
                  type="text" 
                  id="subtotal" 
                  :value="formatCurrency(order.subtotal || 0)" 
                  class="form-input bg-gray-100 font-bold"
                  readonly
                />
              </div>
              <div>
                <label for="taxRate" class="form-label">نسبة الضريبة (%)</label>
                <number-input
                  v-model="order.taxRate"
                  @input="handleTaxRateChange"
                  @blur="handleTaxRateBlur"
                  placeholder="مثال: 10"
                  min="0"
                  max="100"
                  step="0.1"
                  class="form-input"
                />
              </div>
              <div>
                <label for="taxAmount" class="form-label">مبلغ الضريبة</label>
                <input 
                  type="text" 
                  id="taxAmount"
                  :value="formatCurrency(order.tax || 0)" 
                  class="form-input bg-gray-100"
                  readonly
                />
              </div>
              <div>
                <label for="total" class="form-label">الإجمالي النهائي</label>
                <input 
                  type="text" 
                  id="total" 
                  :value="formatCurrency(order.total || 0)" 
                  class="form-input bg-gray-100 font-bold"
                  readonly
                />
              </div>
            </div>
          </div>
          
          <!-- ملاحظات -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">ملاحظات</h2>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label for="notes" class="form-label text-lg font-medium text-yellow-800">ملاحظات إضافية</label>
              <textarea 
                id="notes" 
                v-model="order.notes" 
                class="form-input mt-2 bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                rows="4"
                placeholder="أضف أي ملاحظات مهمة حول الطلب..."
              ></textarea>
              <p class="text-sm text-yellow-700 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-.75.32l-3 3a1 1 0 101.5 1.36l1.6-1.6V13a1 1 0 102 0V9a1 1 0 00-.27-.7l-1.6-1.6A1 1 0 0010 6z" clip-rule="evenodd" />
                </svg>
                هذه الملاحظات ستظهر في تفاصيل الطلب والفاتورة
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          :disabled="submitting"
        >
          إنشاء طلب
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase.js'
import { 
  formatCurrency, 
  parseEnglishNumber, 
  convertToEnglishNumbers 
} from '../utils/formatters.js'
import { 
  DEFAULT_TAX_RATE, 
  calculateOrderTotals, 
  calculateItemTotal, 
  normalizeTaxRate,
  getTaxRate
} from '../utils/taxCalculations.js'
import NumberInput from '../components/NumberInput.vue'

export default {
  name: 'CreateOrderView',
  components: {
    NumberInput
  },
  setup() {
    const router = useRouter()
    const submitting = ref(false)

    // بيانات الطلب
    const order = ref({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      items: [
        {
          name: '',
          quantity: 1,
          price: 0,
          total: 0
        }
      ],
      subtotal: 0,
      taxRate: DEFAULT_TAX_RATE, // يمكنك تخصيص القيمة الافتراضية
      tax: 0,
      total: 0,
      notes: '',
      status: 'pending'
    })

    // دالة لحساب إجمالي الطلب
    const calculateOrderTotal = () => {
      const { subtotal, taxAmount, total } = calculateOrderTotals(
        order.value.items,
        normalizeTaxRate(order.value.taxRate)
      )
      order.value.subtotal = subtotal
      order.value.tax = taxAmount
      order.value.total = total
    }

    // معالجة تغيير نسبة الضريبة أثناء الكتابة
    const handleTaxRateChange = () => {
      if (order.value.taxRate !== null && order.value.taxRate !== undefined) {
        const englishValue = convertToEnglishNumbers(order.value.taxRate.toString())
        const parsedValue = parseFloat(englishValue)
        if (!isNaN(parsedValue)) {
          order.value.taxRate = parsedValue
        }
      }
      calculateOrderTotal()
    }

    // معالجة فقدان التركيز من حقل نسبة الضريبة
    const handleTaxRateBlur = () => {
      const taxRate = parseEnglishNumber(order.value.taxRate)
      if (taxRate < 0) {
        order.value.taxRate = 0
      } else if (taxRate > 100) {
        order.value.taxRate = 100
      } else {
        order.value.taxRate = Math.round(taxRate * 10) / 10 // تقريب إلى منزلة عشرية
      }
      calculateOrderTotal()
    }

    // إضافة منتج جديد
    const addItem = () => {
      order.value.items.push({
        name: '',
        quantity: 1,
        price: 0,
        total: 0
      })
    }

    // إزالة منتج
    const removeItem = (index) => {
      order.value.items.splice(index, 1)
      calculateOrderTotal()
    }

    // حساب إجمالي أحد المنتجات عند تغيّر الكمية أو السعر
    const calculateItemTotal = (index) => {
      const item = order.value.items[index]
      if (item) {
        const quantity = Math.max(1, Math.round(parseEnglishNumber(item.quantity) || 1))
        const price = parseEnglishNumber(item.price) || 0
        item.quantity = quantity
        item.total = Math.round((quantity * price) * 100) / 100
        calculateOrderTotal()
      }
    }

    // عند تحميل الصفحة، تعيين نسبة الضريبة الافتراضية وحساب المبدئي
    onMounted(() => {
      order.value.taxRate = DEFAULT_TAX_RATE
      calculateOrderTotal()
    })

    // مراقبة تغييرات المنتجات لإعادة حساب الإجمالي تلقائيًا
    watch(
      () => order.value.items,
      () => {
        calculateOrderTotal()
      },
      { deep: true }
    )

    // دالة إرسال الطلب إلى قاعدة البيانات
    const submitOrder = async () => {
      try {
        submitting.value = true

        // تأكد أن كل منتج محسوب بشكل صحيح
        order.value.items.forEach((_, idx) => calculateItemTotal(idx))

        // التحقق من أن الإجمالي أكبر من صفر
        if (!order.value.total || order.value.total <= 0) {
          alert('إجمالي الطلب يجب أن يكون أكبر من صفر')
          submitting.value = false
          return
        }

        // إعداد بيانات الطلب للحفظ
        const firstProduct = order.value.items[0]
        const productDescription = firstProduct ? firstProduct.name : 'منتج غير محدد'
        const finalNotes = order.value.notes ? order.value.notes.trim() : ''

        const orderData = {
          customer_name: order.value.customer_name.trim(),
          customer_phone: order.value.customer_phone.trim(),
          customer_address: order.value.customer_address.trim(),
          product_description: productDescription,
          subtotal: Number(order.value.subtotal),
          tax_rate: Number(order.value.taxRate),
          tax_amount: Number(order.value.tax),
          total: Number(order.value.total),
          notes: finalNotes,
          status: order.value.status,
          sales_rep_id: JSON.parse(localStorage.getItem('user') || '{}').id
        }
        
        // إنشاء الطلب في Supabase
        const { data: createdOrder, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
        if (orderError) throw orderError

        const orderId = createdOrder[0].id

        // حفظ كل منتج في جدول order_products
        for (const item of order.value.items) {
          const productData = {
            order_id: orderId,
            name: item.name,
            description: item.description || '',
            notes: item.notes || '',
            quantity: Number(item.quantity),
            price: Number(item.price),
            total: Number(item.quantity * item.price)
          }
          const { error: productError } = await supabase
            .from('order_products')
            .insert([productData])
          if (productError) throw productError
        }

        // بعد الإضافة، العودة إلى صفحة قائمة الطلبات
        router.push('/orders')
      } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error)
        alert('حدث خطأ أثناء إنشاء الطلب: ' + (error.message || 'خطأ غير معروف'))
      } finally {
        submitting.value = false
      }
    }

    return {
      order,
      submitting,
      addItem,
      removeItem,
      calculateItemTotal,
      handleTaxRateChange,
      handleTaxRateBlur,
      submitOrder,
      formatCurrency,
      parseEnglishNumber,
      convertToEnglishNumbers
    }
  }
}
</script>

<style scoped>
/* أي تنسيقات إضافية إن وجدت */
</style>
