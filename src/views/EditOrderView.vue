<template>
  <div>
    <!-- حالة التحميل -->
    <div v-if="loading" class="text-center py-8">
      <p>جاري تحميل البيانات...</p>
    </div>
    
    <!-- حالة عدم وجود الطلب -->
    <div v-else-if="!order.id" class="text-center py-8">
      <p>لم يتم العثور على الطلب</p>
      <router-link to="/orders" class="btn btn-primary mt-4">العودة إلى الطلبات</router-link>
    </div>
    
    <!-- نموذج تعديل الطلب -->
    <div v-else>
      <!-- عنوان الصفحة -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">تعديل الطلب رقم #{{ order.id }}</h1>
        <router-link :to="`/orders/${order.id}`" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          العودة إلى تفاصيل الطلب
        </router-link>
      </div>
      
      <!-- نموذج تعديل الطلب -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form @submit.prevent="updateOrder">
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
                    placeholder="أدخل اسم العميل الكامل"
                    maxlength="100"
                  />
                </div>
                
                <div>
                  <label for="customer-phone" class="form-label">رقم الهاتف <span class="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    id="customer-phone" 
                    v-model="order.customer_phone" 
                    class="form-input"
                    required
                    placeholder="مثال: +966501234567 أو 0501234567"
                    pattern="[\+]?[0-9\-\s()]{8,20}"
                    title="يرجى إدخال رقم هاتف صحيح (يمكن أن يبدأ بـ + للأرقام الدولية)"
                  />
                </div>
                
                <div>
                  <label for="customer-address" class="form-label">العنوان <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="customer-address" 
                    v-model="order.customer_address" 
                    class="form-input"
                    required
                    placeholder="أدخل العنوان الكامل"
                    maxlength="200"
                  />
                </div>
              </div>
            </div>
            
            <!-- المنتجات -->
            <div class="col-span-1 md:col-span-2">
              <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">المنتجات</h2>
              
              <div v-for="(item, index) in order.items" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label :for="`item-name-${index}`" class="form-label">اسم المنتج <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      :id="`item-name-${index}`" 
                      v-model="item.name" 
                      class="form-input"
                      required
                      placeholder="أدخل اسم المنتج"
                      maxlength="100"
                    />
                  </div>
                  
                  <div>
                    <label :for="`item-quantity-${index}`" class="form-label">الكمية <span class="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      :id="`item-quantity-${index}`" 
                      v-model.number="item.quantity" 
                      class="form-input"
                      min="1"
                      max="9999"
                      step="1"
                      required
                      placeholder="1"
                      @input="calculateItemTotal(index)"
                      @blur="item.quantity = Math.round(parseEnglishNumber(item.quantity)) || 1; calculateItemTotal(index)"
                    />
                  </div>
                  
                  <div>
                    <label :for="`item-price-${index}`" class="form-label">السعر (يورو) <span class="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      :id="`item-price-${index}`" 
                      v-model.number="item.price" 
                      class="form-input"
                      min="0.01"
                      max="999999"
                      step="0.01"
                      required
                      placeholder="0.00"
                      @input="calculateItemTotal(index)"
                      @blur="item.price = parseEnglishNumber(item.price); calculateItemTotal(index)"
                    />
                  </div>
                  
                  <div>
                    <label class="form-label">الإجمالي</label>
                    <input 
                      type="text" 
                      :value="formatCurrency(item.total || 0)" 
                      class="form-input bg-gray-100"
                      readonly
                    />
                  </div>
                  
                  <div>
                    <button 
                      type="button" 
                      @click="removeItem(index)" 
                      class="btn btn-danger w-full"
                      :disabled="order.items.length === 1"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                type="button" 
                @click="addItem" 
                class="btn bg-green-500 text-white hover:bg-green-600 mb-4"
              >
                إضافة منتج
              </button>
            </div>
            
            <!-- ملخص الطلب -->
            <div class="col-span-1 md:col-span-2">
              <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">ملخص الطلب</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label for="subtotal" class="form-label">المجموع الفرعي</label>
                  <input 
                    type="text" 
                    id="subtotal" 
                    :value="formatCurrency(order.subtotal || 0)" 
                    class="form-input bg-gray-100"
                    readonly
                  />
                </div>
                
                <div>
                  <label for="tax-rate" class="form-label">نسبة الضريبة (%)</label>
                  <input 
                    type="number" 
                    id="tax-rate" 
                    v-model.number="order.taxRate" 
                    class="form-input"
                    min="0"
                    max="100"
                    step="0.1"
                    @input="handleTaxRateChange"
                    @blur="handleTaxRateBlur"
                    @keyup="handleTaxRateChange"
                  />
                </div>
                
                <div>
                  <label for="tax" class="form-label">قيمة الضريبة</label>
                  <input 
                    type="text" 
                    id="tax" 
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
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  هذه الملاحظات ستظهر في تفاصيل الطلب والفاتورة
                </p>
              </div>
            </div>
          </div>
          
          <!-- أزرار الإجراءات -->
          <div class="flex justify-end space-x-4 space-x-reverse mt-6">
            <router-link :to="`/orders/${order.id}`" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
              إلغاء
            </router-link>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else">حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../services/supabase.js'
import { formatCurrency, parseEnglishNumber, convertToEnglishNumbers } from '../utils/formatters.js'

export default {
  name: 'EditOrderView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(true)
    const submitting = ref(false)
    
    // بيانات الطلب
    const order = ref({
      id: null,
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
      taxRate: 15, // نسبة الضريبة القابلة للتعديل
      tax: 0,
      total: 0,
      notes: '',
      status: 'new'
    })
    
    // حساب إجمالي المنتج
    const calculateItemTotal = (index) => {
      const item = order.value.items[index]
      if (item) {
        // ضمان أن الكمية رقم صحيح
        const quantity = Math.round(parseEnglishNumber(item.quantity)) || 1
        const price = parseEnglishNumber(item.price) || 0
        
        // تحديث الكمية في النموذج لتكون رقماً صحيحاً
        item.quantity = quantity
        
        // تقريب إجمالي المنتج إلى منزلتين عشريتين
        item.total = Math.round((quantity * price) * 100) / 100
        
        // إعادة حساب إجمالي الطلب فوراً
        calculateOrderTotal()
      }
    }
    
    // حساب إجمالي الطلب مع التقريب إلى منزلتين عشريتين
    const calculateOrderTotal = () => {
      // حساب المجموع الفرعي
      const subtotal = order.value.items.reduce((sum, item) => {
        const itemTotal = parseEnglishNumber(item.total) || 0
        return sum + itemTotal
      }, 0)
      
      // تقريب المجموع الفرعي إلى منزلتين عشريتين
      const roundedSubtotal = Math.round(subtotal * 100) / 100
      
      // حساب نسبة الضريبة (تحويل من نسبة مئوية إلى عدد عشري)
      const taxRate = parseEnglishNumber(order.value.taxRate) / 100
      
      // حساب قيمة الضريبة وتقريبها إلى منزلتين عشريتين
      const tax = Math.round((roundedSubtotal * taxRate) * 100) / 100
      
      // حساب الإجمالي النهائي وتقريبه إلى منزلتين عشريتين
      const total = Math.round((roundedSubtotal + tax) * 100) / 100
      
      // تحديث القيم في النموذج
      order.value.subtotal = roundedSubtotal
      order.value.tax = tax
      order.value.total = total
    }
    
    // معالجة تغيير نسبة الضريبة
    const handleTaxRateChange = () => {
      // تحويل الأرقام العربية إلى إنجليزية فوراً
      if (order.value.taxRate) {
        const englishValue = convertToEnglishNumbers(order.value.taxRate.toString())
        const parsedValue = parseFloat(englishValue)
        if (!isNaN(parsedValue)) {
          order.value.taxRate = parsedValue
        }
      }
      // إعادة حساب الإجمالي فوراً
      calculateOrderTotal()
    }
    
    // معالجة فقدان التركيز من حقل نسبة الضريبة
    const handleTaxRateBlur = () => {
      // ضمان أن القيمة رقمية وفي النطاق المسموح
      const taxRate = parseEnglishNumber(order.value.taxRate)
      if (taxRate < 0) {
        order.value.taxRate = 0
      } else if (taxRate > 100) {
        order.value.taxRate = 100
      } else {
        order.value.taxRate = Math.round(taxRate * 10) / 10 // تقريب إلى منزلة عشرية واحدة
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
    
    // حذف منتج
    const removeItem = (index) => {
      if (order.value.items.length > 1) {
        order.value.items.splice(index, 1)
        calculateOrderTotal()
      }
    }
    
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      loading.value = true
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', route.params.id)
          .single()
        
        if (error) throw error
        
        // تحويل بيانات الطلب إلى تنسيق النموذج
        order.value = {
          id: data.id,
          customer_name: data.customer_name || '',
          customer_phone: data.customer_phone || '',
          customer_address: data.customer_address || '',
          items: [
            {
              name: data.product_description || '',
              quantity: data.quantity || 1,
              price: data.unit_price || (data.subtotal / (data.quantity || 1)),
              total: data.subtotal || 0
            }
          ],
          subtotal: data.subtotal || 0,
          taxRate: data.tax_rate || 15,
          tax: data.tax_amount || 0,
          total: data.total || 0,
          notes: data.notes || '',
          status: data.status || 'new'
        }
        
        // إعادة حساب الإجماليات للتأكد من الدقة
        calculateOrderTotal()
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
        order.value = { id: null }
      } finally {
        loading.value = false
      }
    }
    
    // تحديث الطلب
    const updateOrder = async () => {
      try {
        submitting.value = true
        
        // التحقق من صحة بيانات العميل
        if (!order.value.customer_name || order.value.customer_name.trim() === '') {
          alert('يرجى إدخال اسم العميل')
          return
        }
        
        if (!order.value.customer_phone || order.value.customer_phone.trim() === '') {
          alert('يرجى إدخال رقم هاتف العميل')
          return
        }
        
        if (!order.value.customer_address || order.value.customer_address.trim() === '') {
          alert('يرجى إدخال عنوان العميل')
          return
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneRegex = /^[0-9+\-\s()]{8,15}$/
        if (!phoneRegex.test(order.value.customer_phone.trim())) {
          alert('يرجى إدخال رقم هاتف صحيح (8-15 رقم)')
          return
        }
        
        // التحقق من صحة بيانات المنتجات
        if (!order.value.items || order.value.items.length === 0) {
          alert('يرجى إضافة منتج واحد على الأقل')
          return
        }
        
        for (let i = 0; i < order.value.items.length; i++) {
          const item = order.value.items[i]
          
          if (!item.name || item.name.trim() === '') {
            alert(`يرجى إدخال اسم المنتج رقم ${i + 1}`)
            return
          }
          
          if (!item.quantity || item.quantity <= 0) {
            alert(`يرجى إدخال كمية صحيحة للمنتج رقم ${i + 1}`)
            return
          }
          
          if (!item.price || item.price <= 0) {
            alert(`يرجى إدخال سعر صحيح للمنتج رقم ${i + 1}`)
            return
          }
        }
        
        // التحقق من أن الإجمالي أكبر من صفر
        if (!order.value.total || order.value.total <= 0) {
          alert('إجمالي الطلب يجب أن يكون أكبر من صفر')
          return
        }
        
        // إعداد بيانات الطلب للتحديث - استخدام الحقول الموجودة فقط في قاعدة البيانات
        // حساب الكمية الإجمالية وسعر الوحدة المتوسط للعرض فقط
        const totalQuantity = order.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        const averageUnitPrice = totalQuantity > 0 ? (order.value.subtotal / totalQuantity) : 0
        
        // حفظ المنتج الأول فقط في وصف المنتج (عدم التجميع)
        const primaryProduct = order.value.items.length > 0 ? order.value.items[0] : null
        const productDescription = primaryProduct ? 
          `${primaryProduct.name}` : 
          'منتج غير محدد'
        
        // حفظ تفاصيل جميع المنتجات في الملاحظات للمرجعية
        const allProductsDetails = order.value.items.map(item => 
          `${item.name} (الكمية: ${item.quantity}, السعر: €${item.price})`
        ).join(', ')
        
        // إضافة معلومات إضافية في الملاحظات
        const additionalInfo = `المنتجات: ${allProductsDetails}\nالكمية الإجمالية: ${totalQuantity}\nسعر الوحدة المتوسط: €${Math.round(averageUnitPrice * 100) / 100}`
        const finalNotes = order.value.notes ? 
          `${order.value.notes.trim()}\n\n${additionalInfo}` : 
          additionalInfo
        
        const orderData = {
          customer_name: order.value.customer_name.trim(),
          customer_phone: order.value.customer_phone.trim(),
          customer_address: order.value.customer_address.trim(),
          product_description: productDescription,
          subtotal: Number(order.value.subtotal),
          tax_rate: Number(order.value.taxRate),
          tax_amount: Number(order.value.tax),
          total: Number(order.value.total),
          notes: finalNotes
        }
        
        // تحديث الطلب في قاعدة البيانات
        const { data, error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order.value.id)
          .select()
        
        if (error) throw error
        
        alert('تم تحديث الطلب بنجاح')
        router.push(`/orders/${order.value.id}`)
      } catch (error) {
        console.error('خطأ في تحديث الطلب:', error)
        alert('حدث خطأ أثناء تحديث الطلب: ' + (error.message || 'خطأ غير معروف'))
      } finally {
        submitting.value = false
      }
    }
    
    // مراقبة تغييرات المنتجات
    watch(() => order.value.items, () => {
      calculateOrderTotal()
    }, { deep: true })
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      loading,
      order,
      submitting,
      calculateItemTotal,
      calculateOrderTotal,
      handleTaxRateChange,
      handleTaxRateBlur,
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
/* تنسيقات إضافية إذا لزم الأمر */
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

