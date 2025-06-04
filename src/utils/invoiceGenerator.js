import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

/**
 * إنشاء فاتورة من بيانات الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Object} company - بيانات الشركة (اختياري)
 * @param {Object} salesRep - بيانات المندوب (اختياري)
 * @returns {jsPDF} كائن PDF
 */
export function generateInvoice(order, company = null, salesRep = null) {
  // إنشاء مستند PDF جديد
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // إعداد الخط العربي
  doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.woff', 'Cairo', 'normal');
  doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-700-normal.woff', 'Cairo', 'bold');
  doc.setFont('Cairo');

  // بيانات الشركة الافتراضية
  const defaultCompany = {
    name: 'شركة إدارة الطلبات',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966 123456789',
    email: 'info@orders-management.com',
    website: 'www.orders-management.com',
    taxNumber: '123456789'
  };

  // استخدام بيانات الشركة المقدمة أو الافتراضية
  company = company || defaultCompany;

  // إضافة ترويسة الفاتورة
  doc.setFontSize(24);
  doc.setTextColor(0, 102, 204);
  doc.text('فاتورة', doc.internal.pageSize.width / 2, 20, { align: 'center' });

  // إضافة بيانات الشركة
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(company.name, doc.internal.pageSize.width - 15, 35, { align: 'right' });
  doc.setFontSize(10);
  doc.text(company.address, doc.internal.pageSize.width - 15, 40, { align: 'right' });
  doc.text(`هاتف: ${company.phone}`, doc.internal.pageSize.width - 15, 45, { align: 'right' });
  doc.text(`البريد الإلكتروني: ${company.email}`, doc.internal.pageSize.width - 15, 50, { align: 'right' });
  doc.text(`الرقم الضريبي: ${company.taxNumber}`, doc.internal.pageSize.width - 15, 55, { align: 'right' });

  // إضافة بيانات الفاتورة
  doc.setFontSize(12);
  doc.text(`رقم الفاتورة: INV-${order.id}`, 15, 35);
  doc.text(`تاريخ الفاتورة: ${formatDate(order.created_at)}`, 15, 40);
  doc.text(`حالة الطلب: ${getOrderStatusText(order.status)}`, 15, 45);

  // إضافة بيانات العميل
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 60, doc.internal.pageSize.width - 30, 25, 'F');
  doc.setFontSize(12);
  doc.setTextColor(0, 102, 204);
  doc.text('بيانات العميل', doc.internal.pageSize.width - 20, 67);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`الاسم: ${order.customer_name}`, doc.internal.pageSize.width - 20, 73);
  doc.text(`الهاتف: ${order.customer_phone || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 78);
  doc.text(`العنوان: ${order.customer_address || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 83);

  // إضافة بيانات المندوب
  if (salesRep) {
    doc.text('بيانات المندوب', 20, 67);
    doc.text(`الاسم: ${salesRep.name}`, 20, 73);
    doc.text(`الهاتف: ${salesRep.phone || 'غير متوفر'}`, 20, 78);
    doc.text(`البريد الإلكتروني: ${salesRep.email}`, 20, 83);
  }

  // إضافة جدول المنتجات
  doc.setFontSize(12);
  doc.setTextColor(0, 102, 204);
  doc.text('تفاصيل المنتجات', doc.internal.pageSize.width / 2, 95, { align: 'center' });

  // إنشاء جدول المنتجات
  const tableColumn = ['الإجمالي', 'الضريبة', 'السعر', 'الكمية', 'الوصف'];
  const tableRows = [
    [
      formatCurrency(order.subtotal + order.tax_amount),
      `${order.tax_rate}%`,
      formatCurrency(order.unit_price),
      order.quantity,
      order.product_description
    ]
  ];

  // إضافة الجدول
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 100,
    styles: { font: 'Cairo', halign: 'right' },
    headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { right: 15, left: 15 }
  });

  // إضافة ملخص الفاتورة
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`المجموع الفرعي: ${formatCurrency(order.subtotal)}`, doc.internal.pageSize.width - 15, finalY, { align: 'right' });
  doc.text(`قيمة الضريبة (${order.tax_rate}%): ${formatCurrency(order.tax_amount)}`, doc.internal.pageSize.width - 15, finalY + 5, { align: 'right' });
  doc.setFontSize(12);
  doc.setTextColor(0, 102, 204);
  doc.text(`الإجمالي: ${formatCurrency(order.total)}`, doc.internal.pageSize.width - 15, finalY + 12, { align: 'right' });

  // إضافة ملاحظات
  if (order.notes) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('ملاحظات:', 15, finalY + 25);
    doc.text(order.notes, 15, finalY + 30);
  }

  // إضافة تذييل الصفحة
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('تم إنشاء هذه الفاتورة بواسطة نظام إدارة الطلبات', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  // حفظ الفاتورة
  doc.save(`فاتورة-${order.id}.pdf`);
  
  return doc;
}

/**
 * الحصول على نص حالة الطلب
 * @param {string} status - رمز حالة الطلب
 * @returns {string} النص المقابل لحالة الطلب
 */
function getOrderStatusText(status) {
  const statusMap = {
    'new': 'جديد',
    'completed_pending_delivery': 'مكتمل بانتظار التسليم',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغى'
  };
  
  return statusMap[status] || status;
}
