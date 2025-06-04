/**
 * ملف المنسقات - يحتوي على دوال تنسيق العملة والتاريخ والنصوص
 * مع ضمان استخدام الأرقام الإنجليزية في جميع أنحاء المشروع
 */

/**
 * تحويل الأرقام العربية إلى إنجليزية
 * @param {string} str - النص المحتوي على أرقام عربية
 * @returns {string} - النص مع الأرقام الإنجليزية
 */
export const convertToEnglishNumbers = (str) => {
  if (!str) return str;
  
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = str.toString();
  for (let i = 0; i < arabicNumbers.length; i++) {
    result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
  }
  
  return result;
};

/**
 * تحويل قيمة رقمية وضمان استخدام الأرقام الإنجليزية
 * @param {string|number} value - القيمة المراد تحويلها
 * @returns {number} - القيمة الرقمية بالأرقام الإنجليزية
 */
export const parseEnglishNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  
  const englishValue = convertToEnglishNumbers(value.toString());
  const parsed = parseFloat(englishValue);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * تحويل تلقائي للأرقام في حقول الإدخال
 * يستخدم في event handlers لضمان التحويل الفوري
 * @param {Event} event - حدث الإدخال
 * @returns {string} - القيمة المحولة
 */
export const autoConvertNumbers = (event) => {
  const input = event.target;
  const convertedValue = convertToEnglishNumbers(input.value);
  input.value = convertedValue;
  return convertedValue;
};

/**
 * تنسيق رقم للعرض مع ضمان الأرقام الإنجليزية
 * @param {number|string} value - القيمة المراد تنسيقها
 * @param {number} decimals - عدد المنازل العشرية (افتراضي: 2)
 * @returns {string} - الرقم منسق بالأرقام الإنجليزية
 */
export const formatNumber = (value, decimals = 2) => {
  const numericValue = parseEnglishNumber(value);
  const formatted = numericValue.toFixed(decimals);
  return convertToEnglishNumbers(formatted);
};

/**
 * تنسيق رقم صحيح للعرض مع ضمان الأرقام الإنجليزية
 * @param {number|string} value - القيمة المراد تنسيقها
 * @returns {string} - الرقم الصحيح منسق بالأرقام الإنجليزية
 */
export const formatInteger = (value) => {
  const numericValue = Math.round(parseEnglishNumber(value));
  return convertToEnglishNumbers(numericValue.toString());
};

/**
 * تنسيق المبلغ كعملة يورو مع ضمان استخدام الأرقام الإنجليزية
 * @param {number} amount - المبلغ المراد تنسيقه
 * @returns {string} - المبلغ منسقاً كعملة يورو بالأرقام الإنجليزية
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '€0.00';
  
  // تحويل إلى رقم وضمان دقة المنزلتين العشريتين
  const numericAmount = parseEnglishNumber(amount);
  const roundedAmount = Math.round(numericAmount * 100) / 100;
  
  // تنسيق المبلغ باستخدام locale إنجليزي لضمان الأرقام الإنجليزية
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(roundedAmount);
  
  // استبدال رمز EUR بـ € وضمان الأرقام الإنجليزية
  return convertToEnglishNumbers(formatted.replace(/EUR/g, '€'));
};

/**
 * تنسيق رقم الهاتف مع ضمان الأرقام الإنجليزية
 * @param {string} phone - رقم الهاتف
 * @returns {string} - رقم الهاتف بالأرقام الإنجليزية
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return convertToEnglishNumbers(phone.toString());
};

/**
 * تنسيق النسبة المئوية مع ضمان الأرقام الإنجليزية
 * @param {number|string} percentage - النسبة المئوية
 * @param {number} decimals - عدد المنازل العشرية (افتراضي: 1)
 * @returns {string} - النسبة منسقة مع علامة %
 */
export const formatPercentage = (percentage, decimals = 1) => {
  const numericValue = parseEnglishNumber(percentage);
  const formatted = numericValue.toFixed(decimals);
  return `${convertToEnglishNumbers(formatted)}%`;
};

/**
 * تنسيق التاريخ بالتقويم الميلادي
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ منسقاً بالتقويم الميلادي
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    calendar: 'gregory'
  }).format(new Date(date));
};

/**
 * تنسيق التاريخ والوقت بالتقويم الميلادي
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ والوقت منسقاً بالتقويم الميلادي
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'gregory'
  }).format(new Date(date));
};

/**
 * الحصول على نص حالة الطلب
 * @param {string} status - رمز حالة الطلب
 * @returns {string} - النص المقابل لحالة الطلب
 */
export const getOrderStatusText = (status) => {
  const statusMap = {
    'new': 'جديد',
    'completed_pending_delivery': 'مكتمل بانتظار التسليم',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغى'
  };
  
  return statusMap[status] || status;
};

/**
 * الحصول على صنف CSS لحالة الطلب
 * @param {string} status - رمز حالة الطلب
 * @returns {string} - صنف CSS المقابل لحالة الطلب
 */
export const getOrderStatusClass = (status) => {
  const classMap = {
    'new': 'bg-blue-100 text-blue-800',
    'completed_pending_delivery': 'bg-yellow-100 text-yellow-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * الحصول على نص دور المستخدم
 * @param {string} role - رمز دور المستخدم
 * @returns {string} - النص المقابل لدور المستخدم
 */
export const getUserRoleText = (role) => {
  const roleMap = {
    'admin': 'مدير عام',
    'sales_manager': 'مدير مبيعات',
    'representative': 'مندوب مبيعات'
  };
  
  return roleMap[role] || role;
};

/**
 * الحصول على نص حالة المستخدم
 * @param {string} status - رمز حالة المستخدم
 * @returns {string} - النص المقابل لحالة المستخدم
 */
export const getUserStatusText = (status) => {
  const statusMap = {
    'active': 'نشط',
    'inactive': 'غير نشط'
  };
  
  return statusMap[status] || status;
};

/**
 * الحصول على صنف CSS لحالة المستخدم
 * @param {string} status - رمز حالة المستخدم
 * @returns {string} - صنف CSS المقابل لحالة المستخدم
 */
export const getUserStatusClass = (status) => {
  const classMap = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800'
  };
  
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * دالة مشاركة واتساب موحدة لجميع أنحاء الموقع
 * @param {Object} order - بيانات الطلب
 * @returns {void} - يفتح رابط واتساب
 */
export const shareOrderOnWhatsApp = (order) => {
  if (!order) return;
  
  // استخراج معلومات المنتجات من جدول order_products أو product_description
  let productsText = '';
  
  if (order.products && order.products.length > 0) {
    // استخدام المنتجات من الجدول المنفصل (النظام الجديد)
    productsText = order.products.map((product, index) => {
      let productText = `${index + 1}. ${product.name}`;
      if (product.description) {
        productText += `\nالوصف: ${product.description}`;
      }
      productText += `\nالكمية: ${convertToEnglishNumbers(product.quantity.toString())}`;
      productText += `\nسعر الوحدة: ${formatCurrency(product.unit_price)}`;
      productText += `\nالمجموع: ${formatCurrency(product.subtotal)}`;
      if (product.notes) {
        productText += `\nملاحظات: ${product.notes}`;
      }
      return productText;
    }).join('\n\n');
  } else {
    // استخدام product_description للطلبات القديمة
    try {
      if (order.product_description) {
        // محاولة تحليل JSON
        const products = JSON.parse(order.product_description);
        if (Array.isArray(products) && products.length > 0) {
          productsText = products.map((product, index) => 
            `${index + 1}. ${product.name}\nالكمية: ${convertToEnglishNumbers(product.quantity.toString())}\nالسعر: €${convertToEnglishNumbers(product.price.toString())}`
          ).join('\n\n');
        } else {
          productsText = `1. ${order.product_description}`;
        }
      }
    } catch (error) {
      // إذا فشل تحليل JSON، استخدم النص كما هو
      productsText = `1. ${order.product_description || 'منتج غير محدد'}`;
    }
  }
  
  // إضافة ملاحظات الطلب إذا وجدت
  let notesText = '';
  if (order.notes && order.notes.trim()) {
    notesText = `\n📝 ملاحظات الطلب:\n${order.notes.trim()}`;
  }
  
  // رسالة واضحة مع كل معلومة في سطر منفصل - موحدة لجميع المنصات
  const message = `🛍️ تفاصيل الطلب رقم ${order.id}

👤 معلومات العميل:
الاسم: ${order.customer_name}
الهاتف: ${order.customer_phone || 'غير متوفر'}
العنوان: ${order.customer_address || 'غير متوفر'}

📦 المنتجات المطلوبة:
${productsText}

💰 تفاصيل الفاتورة:
المجموع الفرعي: ${formatCurrency(order.subtotal)}${order.tax_rate > 0 && order.tax_amount > 0 ? `
الضريبة: ${convertToEnglishNumbers((order.tax_rate || 0).toString())}%
مبلغ الضريبة: ${formatCurrency(order.tax_amount)}` : ''}
الإجمالي النهائي: ${formatCurrency(order.total)}

${order.status ? `📋 حالة الطلب: ${getOrderStatusText(order.status)}` : ''}${notesText}

---
تم إنشاء هذا الطلب من نظام إدارة الطلبات`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // استخدام نفس الرابط لجميع المنصات (موبايل وكمبيوتر)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
  
  // فتح الرابط - يعمل على جميع المنصات
  window.open(whatsappUrl, '_blank');
};

