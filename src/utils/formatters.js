/**
 * ملف المنسقات - يحتوي على دوال تنسيق العملة والتاريخ والنصوص
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
 * تنسيق المبلغ كعملة يورو
 * @param {number} amount - المبلغ المراد تنسيقه
 * @returns {string} - المبلغ منسقاً كعملة يورو
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00 €';
  
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace(/EUR/g, '€');
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
