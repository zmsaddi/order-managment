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

    <!-- عرض دائرة التحميل -->
    <div v-if="loading" class="text-center py-8">
      <p>جاري تحميل بيانات الطلب…</p>
    </div>

    <!-- محتوى النموذج -->
    <div v-else class="bg-white rounded-lg shadow-sm p-6">
      <form @submit.prevent="updateOrder">
        <!-- بيانات العميل -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              pattern="^\+?[0-9 \(\)\-]{8,20}$"
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

        <!-- تفاصيل المنتجات -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">تفاصيل المنتج</h2>
          <div class="overflow-x-auto">
            <!-- رأس الجدول -->
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
                @blur="onItemBlur(index)"
                placeholder="1"
                class="form-input text-center"
                min="1"
                required
              />

              <!-- السعر لكل وحدة -->
              <input
                type="number"
                v-model.number="item.price"
                @blur="onItemBlur(index)"
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

              <!-- زر إزالة الصف -->
              <button
                type="button"
                @click="removeItem(index)"
                class="text-red-600 hover:text-red-800"
              >
                إزالة
              </button>
            </div>

            <!-- زر إضافة صف جديد -->
            <button
              type="button"
              @click="addItem"
              class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              إضافة عنصر جديد
            </button>
          </div>
        </div>

        <!-- ملخص الأسعار -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              @blur="onTaxBlur"
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

        <!-- ملاحظات -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">ملاحظات</h2>
          <textarea
            v-model="order.notes"
            class="form-input w-full border rounded p-2"
            rows="4"
            placeholder="أضف أي ملاحظات إضافية حول الطلب"
          ></textarea>
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

// دالة لمضاعفة كمية وسعر لحساب subtotal فردي
function computeItemSubtotal(qty, price) {
  return Math.round(qty * price * 100) / 100
}

// دالة لحساب مجمل الطلب بما فيها الضريبة
function computeOrderTotals(items, taxRate) {
  let sum = 0
  items.forEach(it => {
    sum += it.subtotal || 0
  })
  sum = Math.round(sum * 100) / 100
  const taxAmt = Math.round(sum * (taxRate / 100) * 100) / 100
  const grandTot = Math.round((sum + taxAmt) * 100) / 100
  return { subtotal: sum, taxAmount: taxAmt, total: grandTot }
}

export default {
  name: 'EditOrderView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // استخراج معرف الطلب وتحويله إلى رقم
    const rawId = route.params.id
    const orderId = Number(rawId)

    const loading = ref(true)
    const submitting = ref(false)

    // إذا كان المعرف غير صالح، عُد إلى صفحة القائمة
    if (!Number.isInteger(orderId) || orderId <= 0) {
      alert('معرّف الطلب غير صالح')
      router.push('/orders')
      return {}
    }

    // هيكلة بيانات الطلب الأولية
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

    // جلب بيانات الطلب ومنتجاته
    const fetchOrder = async () => {
      try {
        loading.value = true

        // 1) جلب بيانات الطلب نفسها
        const { data: ordData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
        if (orderErr) throw orderErr

        // 2) جلب جميع منتجات هذا الطلب
        const { data: prodData, error: prodErr } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId)
        if (prodErr) throw prodErr

        // 3) ملء الحقول الرئيسية في order
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

        // 4) إذا كانت هناك منتجات، املأها؛ وإلا اترك صفًا واحدًا فارغًا
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
        alert('فشل جلب بيانات الطلب')
        router.push('/orders')
      } finally {
        loading.value = false
      }
    }

    // عند فقدان التركيز في حقل الكمية أو السعر لأي منتج
    const onItemBlur = (index) => {
      const item = order.value.items[index]
      if (!item) return

      // تأكد من أن qty و price عددان صحيحان أو عشريان
      const qty = Math.max(1, parseEnglishNumber(item.quantity) || 1)
      const pr = parseEnglishNumber(item.price) || 0

      item.quantity = qty
      item.subtotal = computeItemSubtotal(qty, pr)

      // بعد تعديل أي صف، أعد حساب مجمل الطلب
      onOrderRecalc()
    }

    // إعادة حساب مجمل الطلب بعد أي تغيير
    const onOrderRecalc = () => {
      const { subtotal, taxAmount, total } = computeOrderTotals(
        order.value.items,
        order.value.tax_rate
      )
      order.value.subtotal = subtotal
      order.value.tax_amount = taxAmount
      order.value.total = total
    }

    // عند فقدان التركيز من حقل نسبة الضريبة
    const onTaxBlur = () => {
      let tr = parseEnglishNumber(order.value.tax_rate)
      if (isNaN(tr) || tr < 0) tr = 0
      if (tr > 100) tr = 100
      order.value.tax_rate = Math.round(tr * 10) / 10

      onOrderRecalc()
    }

    // إضافة صف جديد للمنتج
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
      onOrderRecalc()
    }

    // إزالة صف منتج
    const removeItem = (index) => {
      order.value.items.splice(index, 1)
      onOrderRecalc()
    }

    // حفظ التعديلات في قاعدة البيانات
    const updateOrder = async () => {
      try {
        submitting.value = true

        // أعد حساب كل صف قبل الحفظ
        order.value.items.forEach((_, idx) => onItemBlur(idx))

        // تأكد من أن المجمل النهائي أكبر من صفر
        if (!order.value.total || order.value.total <= 0) {
          alert('يجب أن يكون إجمالي الطلب أكبر من صفر')
          submitting.value = false
          return
        }

        // حدد وصف المنتج الأول
        const first = order.value.items[0]
        const prodDesc = first && first.name ? first.name : 'منتج غير محدد'

        // جهّز كائن التحديث لجدول orders
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

        // حدّث الطلب نفسه
        const { error: orderErr } = await supabase
          .from('orders')
          .update(updatedOrderData)
          .eq('id', orderId)
        if (orderErr) throw orderErr

        // احذف منتجات الطلب القديمة
        const { error: delErr } = await supabase
          .from('order_products')
          .delete()
          .eq('order_id', orderId)
        if (delErr) throw delErr

        // أعد إدخال المنتجات الجديدة
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

        // عند النجاح، عد إلى صفحة قائمة الطلبات
        router.push('/orders')
      } catch (err) {
        console.error('خطأ في تحديث الطلب:', err)
        alert('حدث خطأ أثناء حفظ التعديلات.')
      } finally {
        submitting.value = false
      }
    }

    // عند توقيت تهيئة الصفحة
    onMounted(() => {
      fetchOrder()
    })

    // راقب تغيّر كمية أو سعر أي صف وأعد الحساب تلقائيًا
    watch(
      () => order.value.items.map(it => ({ q: it.quantity, p: it.price })),
      () => onOrderRecalc(),
      { deep: true }
    )

    return {
      order,
      loading,
      submitting,
      onItemBlur,
      onTaxBlur,
      addItem,
      removeItem,
      updateOrder,
      formatCurrency,
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
