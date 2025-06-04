/**
 * ملف دوال الضريبة الموحدة
 * يحتوي على جميع الدوال المتعلقة بحساب وعرض الضريبة
 * متوافق مع جميع المنصات: الويب، الموبايل، التابلت، وتطبيق الأندرويد
 */

import { parseEnglishNumber, convertToEnglishNumbers } from './formatters.js';

/**
 * القيمة الافتراضية لنسبة الضريبة
 * @constant {number}
 */
export const DEFAULT_TAX_RATE = 0;

/**
 * الحد الأدنى لنسبة الضريبة
 * @constant {number}
 */
export const MIN_TAX_RATE = 0;

/**
 * الحد الأقصى لنسبة الضريبة
 * @constant {number}
 */
export const MAX_TAX_RATE = 100;

/**
 * حساب قيمة الضريبة بناءً على المبلغ الفرعي ونسبة الضريبة
 * @param {number|string} subtotal - المبلغ الفرعي
 * @param {number|string} taxRate - نسبة الضريبة (كنسبة مئوية)
 * @returns {number} - قيمة الضريبة مقربة إلى منزلتين عشريتين
 */
export const calculateTaxAmount = (subtotal, taxRate = DEFAULT_TAX_RATE) => {
  const numericSubtotal = parseEnglishNumber(subtotal) || 0;
  const numericTaxRate = parseEnglishNumber(taxRate) || DEFAULT_TAX_RATE;
  
  // تحويل النسبة المئوية إلى عدد عشري
  const taxDecimal = numericTaxRate / 100;
  
  // حساب قيمة الضريبة وتقريبها إلى منزلتين عشريتين
  const taxAmount = Math.round((numericSubtotal * taxDecimal) * 100) / 100;
  
  return taxAmount;
};

/**
 * حساب الإجمالي النهائي (المبلغ الفرعي + الضريبة)
 * @param {number|string} subtotal - المبلغ الفرعي
 * @param {number|string} taxRate - نسبة الضريبة (كنسبة مئوية)
 * @returns {number} - الإجمالي النهائي مقرب إلى منزلتين عشريتين
 */
export const calculateTotal = (subtotal, taxRate = DEFAULT_TAX_RATE) => {
  const numericSubtotal = parseEnglishNumber(subtotal) || 0;
  const taxAmount = calculateTaxAmount(numericSubtotal, taxRate);
  
  // حساب الإجمالي النهائي وتقريبه إلى منزلتين عشريتين
  const total = Math.round((numericSubtotal + taxAmount) * 100) / 100;
  
  return total;
};

/**
 * تنظيف وتطبيع نسبة الضريبة
 * @param {number|string} taxRate - نسبة الضريبة المدخلة
 * @returns {number} - نسبة الضريبة منظفة ومطبعة
 */
export const normalizeTaxRate = (taxRate) => {
  const numericTaxRate = parseEnglishNumber(taxRate);
  
  // ضمان أن القيمة في النطاق المسموح
  if (numericTaxRate < MIN_TAX_RATE) {
    return MIN_TAX_RATE;
  } else if (numericTaxRate > MAX_TAX_RATE) {
    return MAX_TAX_RATE;
  }
  
  // تقريب إلى منزلة عشرية واحدة
  return Math.round(numericTaxRate * 10) / 10;
};

/**
 * التحقق من وجود ضريبة (أكبر من صفر)
 * @param {number|string} taxRate - نسبة الضريبة
 * @param {number|string} taxAmount - قيمة الضريبة
 * @returns {boolean} - true إذا كانت هناك ضريبة
 */
export const hasTax = (taxRate, taxAmount = null) => {
  const numericTaxRate = parseEnglishNumber(taxRate) || 0;
  
  if (taxAmount !== null) {
    const numericTaxAmount = parseEnglishNumber(taxAmount) || 0;
    return numericTaxRate > 0 && numericTaxAmount > 0;
  }
  
  return numericTaxRate > 0;
};

/**
 * تنسيق نسبة الضريبة للعرض
 * @param {number|string} taxRate - نسبة الضريبة
 * @returns {string} - نسبة الضريبة منسقة مع علامة %
 */
export const formatTaxRate = (taxRate) => {
  const numericTaxRate = parseEnglishNumber(taxRate) || DEFAULT_TAX_RATE;
  return `${convertToEnglishNumbers(numericTaxRate.toString())}%`;
};

/**
 * حساب تفاصيل الطلب الكاملة (المبلغ الفرعي، الضريبة، الإجمالي)
 * @param {Array} items - قائمة المنتجات
 * @param {number|string} taxRate - نسبة الضريبة
 * @returns {Object} - كائن يحتوي على تفاصيل الحساب
 */
export const calculateOrderTotals = (items = [], taxRate = DEFAULT_TAX_RATE) => {
  // حساب المجموع الفرعي
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = parseEnglishNumber(item.total) || 0;
    return sum + itemTotal;
  }, 0);
  
  // تقريب المجموع الفرعي إلى منزلتين عشريتين
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  
  // حساب قيمة الضريبة
  const taxAmount = calculateTaxAmount(roundedSubtotal, taxRate);
  
  // حساب الإجمالي النهائي
  const total = calculateTotal(roundedSubtotal, taxRate);
  
  return {
    subtotal: roundedSubtotal,
    taxRate: normalizeTaxRate(taxRate),
    taxAmount: taxAmount,
    total: total,
    hasTax: hasTax(taxRate, taxAmount)
  };
};

/**
 * حساب إجمالي منتج واحد
 * @param {number|string} quantity - الكمية
 * @param {number|string} price - السعر الوحدة
 * @returns {number} - إجمالي المنتج مقرب إلى منزلتين عشريتين
 */
export const calculateItemTotal = (quantity, price) => {
  const numericQuantity = Math.round(parseEnglishNumber(quantity)) || 1;
  const numericPrice = parseEnglishNumber(price) || 0;
  
  // حساب الإجمالي وتقريبه إلى منزلتين عشريتين
  const total = Math.round((numericQuantity * numericPrice) * 100) / 100;
  
  return total;
};

/**
 * الحصول على نسبة الضريبة الافتراضية أو المحفوظة
 * @param {number|string} savedTaxRate - نسبة الضريبة المحفوظة
 * @returns {number} - نسبة الضريبة النهائية
 */
export const getTaxRate = (savedTaxRate = null) => {
  if (savedTaxRate !== null && savedTaxRate !== undefined) {
    return normalizeTaxRate(savedTaxRate);
  }
  
  return DEFAULT_TAX_RATE;
};

