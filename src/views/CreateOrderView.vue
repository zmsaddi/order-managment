<template>
  <div>
    <!-- عنوان الصفحة -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إنشاء طلب جديد</h1>
      <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
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
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              بيانات العميل
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="customer-name" class="form-label">
                  اسم العميل <span class="text-red-500">*</span>
                </label>
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
                <label for="customer-phone" class="form-label">
                  رقم هاتف العميل <span class="text-red-500">*</span>
                </label>
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
                <label for="customer-address" class="form-label">
                  عنوان العميل <span class="text-red-500">*</span>
                </label>
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
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              تفاصيل المنتج
            </h2>

            <!-- رأس الجدول: عناوين الأعمدة -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 font-medium text-gray-700">
              <div class="md:col-span-2 text-center">اسم المنتج</div>
              <div class="text-center">الكمية</div>
              <div class="text-center">السعر لكل وحدة (€)</div>
              <div class="text-center">الوصف</div>
              <div class="text-center">إجراء</div>
            </div>

            <!-- صفوف إدخال المنتجات -->
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-center"
            >
              <!-- اسم المنتج -->
              <input
                type="text"
                v-model="item.name"
                placeholder="مثال: قلم"
                class="form-input md:col-span-2"
                required
              />

              <!-- الكمية -->
              <input
                type="number"
                v-model.number="item.quantity"
                @blur="() => calculateItemTotal(index)"
                placeholder="1"
                class="form-input text-center"
                min="1"
                required
              />

              <!-- السعر لكل وحدة -->
              <input
                type="number"
                v-model.number="item.price"
                @blur="() => calculateItemTotal(index)"
                placeholder="0.00"
                class="form-input text-center"
                min="0"
                step="0.01"
                required
              />

              <!-- الوصف -->
              <input
                type="text"
                v-model="item.description"
                placeholder="وصف اختياري"
                class="form-input"
              />

              <!-- زر الإزالة -->
              <button
                type="button"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-800"
              >
                إزالة
              </button>
            </div>

            <!-- زر إضافة عنصر جديد -->
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
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              ملخص الأسعار
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="subtotal" class="form-label">المجموع الفرعي (الطلب)</label>
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
                <input
                  type="number"
                  v-model.number="order.taxRate"
                  @blur="handleTaxRateBlur"
                  placeholder="مثال: 10"
                  class="form-input text-center"
                  min="0"
                  max="100"
                  step="0.1"
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
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              ملاحظات
            </h2>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label for="notes" class="form-label text-lg font-medium text-yellow-800">
                ملاحظات إضافية
              </label>
              <textarea
                id="notes"
                v-model="order.notes"
                class="form-input mt-2 bg-white border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                rows="4"
                placeholder="أضف أي ملاحظات مهمة حول الطلب..."
              ></textarea>
              <p class="text-sm text-yellow-700 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-.75.32l-3 3a1 1 0 101.5 1.36l1.6-1.6V13a1 1 0 102 0V9a1 0 00-.27-.7l-1.6-1.6A1 1 0 0010 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                هذه الملاحظات ستظهر في تفاصيل الطلب والفاتورة
              </p>
            </div>
          </div>
        </div>

        <!-- زر إنشاء الطلب -->
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
import { supabase } from '@/services/supabase.js'
import {
  formatCurrency,
  parseEnglishNumber,
  convertToEnglishNumbers
} from '@/utils/formatters.js'

// استخدم دالتك لحساب المجاميع (يمكن أن تكون من taxCalculations.js أو مكتوبة مباشرة هنا)
function calculateItemSubtotal(quantity, unitPrice) {
  return Math.round((quantity * unitPrice) * 100) / 100
}

function calculateOrderTotals(items, taxRate) {
  let orderSubtotal = 0
  for (const it of items) {
    orderSubtotal += it.subtotal || 0
  }
  orderSubtotal = Math.round(orderSubtotal * 100) / 100
  const taxAmt = Math.round((orderSubtotal * (taxRate / 100)) * 100) / 100
  const grandTotal = Math.round((orderSubtotal + taxAmt) * 100) / 100
  return { subtotal: orderSubtotal, taxAmount: taxAmt, total: grandTotal }
}

export default {
  name: 'CreateOrderView',
  setup() {
    const router = useRouter()
    const submitting = ref(false)

    // بيانات الطلب
    const order = ref({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      product_description: '', // سيُنزل لاحقًا كاسم المنتج الأول
      items: [
        {
          name: '',
          description: '',
          notes: '',
          quantity: 1,
          price: 0,
          subtotal: 0
        }
      ],
      subtotal: 0,
      taxRate: 0,
      tax: 0,
      total: 0,
      notes: '',
      status: 'new'
    })

    // حساب إجمالي الطلب
    const calculateOrderTotal = () => {
      const { subtotal, taxAmount, total } = calculateOrderTotals(
        order.value.items,
        order.value.taxRate
      )
      order.value.subtotal = subtotal
      order.value.tax = taxAmount
      order.value.total = total
    }

    // معالجة تغيير نسبة الضريبة
    const handleTaxRateBlur = () => {
      let tr = parseEnglishNumber(order.value.taxRate)
      if (isNaN(tr) || tr < 0) tr = 0
      if (tr > 100) tr = 100
      order.value.taxRate = Math.round(tr * 10) / 10
      calculateOrderTotal()
    }

    // إضافة منتج جديد
    const addItem = () => {
      order.value.items.push({
        name: '',
        description: '',
        notes: '',
        quantity: 1,
        price: 0,
        subtotal: 0
      })
      calculateOrderTotal()
    }

    // إزالة منتج
    const removeItem = (index) => {
      order.value.items.splice(index, 1)
      calculateOrderTotal()
    }

    // حساب إجمالي العنصر
    const calculateItemTotal = (index) => {
      const item = order.value.items[index]
      if (!item) return
      const q = Math.max(1, parseEnglishNumber(item.quantity) || 1)
      const p = parseEnglishNumber(item.price) || 0
      item.quantity = q
      item.subtotal = calculateItemSubtotal(q, p)
      calculateOrderTotal()
    }

    onMounted(() => {
      // ابدأ بنسبة ضريبة صفر ومجاميع صفرية
      order.value.taxRate = 0
      calculateOrderTotal()
    })

    // راقب تغيير خانة items ليُعاد حساب الإجمالي تلقائيًا
    watch(
      () => order.value.items.map(it => ({ q: it.quantity, p: it.price })),
      () => {
        calculateOrderTotal()
      },
      { deep: true }
    )

    // دالة إرسال الطلب إلى Supabase
    const submitOrder = async () => {
      try {
        submitting.value = true

        // 1) احسب كل عنصر
        order.value.items.forEach((_, idx) => calculateItemTotal(idx))

        // 2) تأكد أن الإجمالي > 0
        if (!order.value.total || order.value.total <= 0) {
          alert('إجمالي الطلب يجب أن يكون أكبر من صفر')
          submitting.value = false
          return
        }

        // 3) حدد وصف المنتج (اسم المنتج الأول)
        const firstProduct = order.value.items[0]
        const productDescription = firstProduct.name || 'منتج غير محدد'
        order.value.product_description = productDescription

        // 4) جهز بيانات جدول orders
        const orderData = {
          customer_name: order.value.customer_name.trim(),
          customer_phone: order.value.customer_phone.trim(),
          customer_address: order.value.customer_address.trim(),
          product_description: order.value.product_description,
          subtotal: order.value.subtotal,
          tax_rate: order.value.taxRate,
          tax_amount: order.value.tax,
          total: order.value.total,
          notes: order.value.notes.trim(),
          status: order.value.status,
          sales_rep_id: JSON.parse(localStorage.getItem('user') || '{}').id
        }

        // 5) أدخل الصف في جدول orders
        const { data: createdOrder, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
        if (orderError) throw orderError

        const orderId = createdOrder[0].id

        // 6) أضف كل عنصر إلى order_products مستخدمًا العمود unit_price و subtotal
        for (const item of order.value.items) {
          const productData = {
            order_id: orderId,
            name: item.name,
            description: item.description || '',
            notes: item.notes || '',
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.subtotal
          }
          const { error: productError } = await supabase
            .from('order_products')
            .insert([productData])
          if (productError) throw productError
        }

        // 7) بعد الإدخال، ارجع لصفحة قائمة الطلبات
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
/* أضف أي تنسيقات إضافية إذا لزم الأمر */
</style>
