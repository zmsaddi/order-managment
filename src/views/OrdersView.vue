<template>
  <div>
    <!-- عنوان الصفحة -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">تعديل الطلب</h1>
      <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        العودة إلى قائمة الطلبات
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>جاري تحميل بيانات الطلب…</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm p-6">
      <form @submit.prevent="updateOrder">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- بيانات العميل -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              بيانات العميل
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="customer-name" class="form-label">اسم العميل <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="customer-name"
                  v-model="order.customer_name"
                  class="form-input"
                  required
                />
              </div>
              <div>
                <label for="customer-phone" class="form-label">رقم هاتف العميل <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="customer-phone"
                  v-model="order.customer_phone"
                  placeholder="+34 600 123 456"
                  pattern="^\+?[0-9\s()\-]{8,20}$"
                  class="form-input"
                  required
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
                />
              </div>
            </div>
          </div>

          <!-- تفاصيل المنتج -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">
              تفاصيل المنتج
            </h2>
            
            <!-- رأس جدول عناوين الأعمدة -->
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
                @blur="() => calculateItemSubtotal(index)"
                placeholder="1"
                class="form-input text-center"
                min="1"
                required
              />

              <!-- السعر لكل وحدة -->
              <input
                type="number"
                v-model.number="item.price"
                @blur="() => calculateItemSubtotal(index)"
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
                  v-model.number="order.tax_rate"
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
                  :value="formatCurrency(order.tax_amount || 0)"
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
            <textarea
              v-model="order.notes"
              class="form-input w-full border rounded p-2"
              rows="4"
              placeholder="أضف أي ملاحظات إضافية حول الطلب"
            ></textarea>
          </div>
        </div>

        <!-- زر حفظ التعديلات -->
        <button
          type="submit"
          class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          :disabled="submitting"
        >
          <span v-if="submitting">جاري الحفظ…</span>
          <span v-else>حفظ التغييرات</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { formatCurrency, parseEnglishNumber, convertToEnglishNumbers } from '@/utils/formatters'

// دالة لحساب مجاميع عنصر واحد
function calculateItemSubtotal(quantity, price) {
  return Math.round((quantity * price) * 100) / 100
}

// دالة لحساب إجماليات الطلب
function calculateOrderTotals(items, taxRate) {
  let orderSubtotal = 0
  items.forEach(it => {
    orderSubtotal += it.subtotal || 0
  })
  orderSubtotal = Math.round(orderSubtotal * 100) / 100
  const taxAmt = Math.round((orderSubtotal * (taxRate / 100)) * 100) / 100
  const grandTotal = Math.round((orderSubtotal + taxAmt) * 100) / 100
  return { subtotal: orderSubtotal, taxAmount: taxAmt, total: grandTotal }
}

export default {
  name: 'EditOrderView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const orderId = Number(route.params.id)

    const loading = ref(true)
    const submitting = ref(false)

    // هيكلة بيانات الطلب مع الحقول اللازمة
    const order = ref({
      id: orderId,
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      product_description: '',
      items: [
        {
          id: null,
          name: '',
          description: '',
          notes: '',
          quantity: 1,
          price: 0,
          subtotal: 0
        }
      ],
      subtotal: 0,
      tax_rate: 0,
      tax_amount: 0,
      total: 0,
      notes: '',
      status: ''
    })

    // جلب بيانات الطلب ومنتجاته عند التحميل
    const fetchOrder = async () => {
      try {
        loading.value = true

        // جلب بيانات الطلب من جدول orders
        const { data: ordData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
        if (orderErr) throw orderErr

        // جلب منتجات الطلب من order_products
        const { data: prodData, error: prodErr } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId)
        if (prodErr) throw prodErr

        // ملء بيانات الطلب
        order.value.customer_name = ordData.customer_name
        order.value.customer_phone = ordData.customer_phone
        order.value.customer_address = ordData.customer_address
        order.value.product_description = ordData.product_description
        order.value.subtotal = ordData.subtotal
        order.value.tax_rate = ordData.tax_rate
        order.value.tax_amount = ordData.tax_amount
        order.value.total = ordData.total
        order.value.notes = ordData.notes || ''
        order.value.status = ordData.status

        // إذا كان هناك منتجات فليتم ملؤها، وإلا احتفظ برقم واحد فارغ
        if (prodData && prodData.length > 0) {
          order.value.items = prodData.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            notes: item.notes || '',
            quantity: Number(item.quantity),
            price: Number(item.unit_price),
            subtotal: Number(item.subtotal)
          }))
        } else {
          order.value.items = [
            {
              id: null,
              name: '',
              description: '',
              notes: '',
              quantity: 1,
              price: 0,
              subtotal: 0
            }
          ]
        }
      } catch (err) {
        console.error('خطأ في جلب بيانات الطلب:', err)
        alert('فشل جلب بيانات الطلب.')
        router.push('/orders')
      } finally {
        loading.value = false
      }
    }

    // دالة لحساب مجاميع عنصر واحد
    const calculateItemSubtotal = (index) => {
      const item = order.value.items[index]
      if (!item) return
      const qty = Math.max(1, parseEnglishNumber(item.quantity) || 1)
      const pr = parseEnglishNumber(item.price) || 0
      item.quantity = qty
      item.subtotal = calculateItemSubtotal(qty, pr)
      calculateOrderTotal()
    }

    // دالة لحساب مجاميع الطلب
    const calculateOrderTotal = () => {
      const { subtotal, taxAmount, total } = calculateOrderTotals(
        order.value.items,
        order.value.tax_rate
      )
      order.value.subtotal = subtotal
      order.value.tax_amount = taxAmount
      order.value.total = total
    }

    // معالجة فقدان التركيز من حقل نسبة الضريبة
    const handleTaxRateBlur = () => {
      let tr = parseEnglishNumber(order.value.tax_rate)
      if (isNaN(tr) || tr < 0) tr = 0
      if (tr > 100) tr = 100
      order.value.tax_rate = Math.round(tr * 10) / 10
      calculateOrderTotal()
    }

    // إضافة صف جديد
    const addItem = () => {
      order.value.items.push({
        id: null,
        name: '',
        description: '',
        notes: '',
        quantity: 1,
        price: 0,
        subtotal: 0
      })
      calculateOrderTotal()
    }

    // إزالة صف موجود
    const removeItem = (index) => {
      order.value.items.splice(index, 1)
      calculateOrderTotal()
    }

    // تحديث الطلب
    const updateOrder = async () => {
      try {
        submitting.value = true

        // 1) أعد حساب كل صنف
        order.value.items.forEach((_, idx) => calculateItemSubtotal(idx))

        // 2) تحقق أن الإجمالي>0
        if (!order.value.total || order.value.total <= 0) {
          alert('يجب أن يكون إجمالي الطلب أكبر من صفر')
          submitting.value = false
          return
        }

        // 3) حدّد وصف المنتج (اسم المنتج الأول)
        const first = order.value.items[0]
        const prodDesc = first && first.name ? first.name : 'منتج غير محدد'

        // 4) جهّز كائن بيانات orders
        const updatedOrderData = {
          customer_name: order.value.customer_name.trim(),
          customer_phone: order.value.customer_phone.trim(),
          customer_address: order.value.customer_address.trim(),
          product_description: prodDesc,
          subtotal: order.value.subtotal,
          tax_rate: order.value.tax_rate,
          tax_amount: order.value.tax_amount,
          total: order.value.total,
          notes: order.value.notes.trim(),
          status: order.value.status
        }

        // 5) حدّث صف الـ orders بناءً على الـ id
        const { error: orderErr } = await supabase
          .from('orders')
          .update(updatedOrderData)
          .eq('id', orderId)
        if (orderErr) throw orderErr

        // 6) احذف كل منتجات هذا الطلب من order_products
        const { error: delErr } = await supabase
          .from('order_products')
          .delete()
          .eq('order_id', orderId)
        if (delErr) throw delErr

        // 7) أعد إدخال كل الأصناف المحدثة
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
          const { error: prodErr } = await supabase
            .from('order_products')
            .insert([productData])
          if (prodErr) throw prodErr
        }

        // 8) العودة إلى صفحة الطلبات
        router.push('/orders')
      } catch (err) {
        console.error('خطأ في تحديث الطلب:', err)
        alert('حدث خطأ أثناء حفظ التعديلات.')
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      fetchOrder()
    })

    // راقب تغيير حقل items لإعادة حساب الطلب
    watch(
      () => order.value.items.map(it => ({ q: it.quantity, p: it.price })),
      () => calculateOrderTotal(),
      { deep: true }
    )

    return {
      order,
      loading,
      submitting,
      addItem,
      removeItem,
      calculateItemSubtotal,
      handleTaxRateBlur,
      updateOrder,
      formatCurrency,
      parseEnglishNumber,
      convertToEnglishNumbers
    }
  }
}
</script>

<style scoped>
/* التنسيقات الإضافية إن وجدت */
</style>
