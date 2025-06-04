import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, getOrderStatusText } from './formatters';

/**
 * توليد فاتورة PDF للطلب
 * @param {Object} order - بيانات الطلب
 * @param {Array} products - منتجات الطلب
 * @param {Object} salesRep - بيانات المندوب
 * @returns {jsPDF} - ملف PDF
 */
export const generateInvoice = (order, products, salesRep) => {
  // إنشاء مستند PDF
  const doc = new jsPDF();
  
  // إعداد الخط
  doc.setFont('helvetica');
  
  // إضافة عنوان الفاتورة
  doc.setFontSize(22);
  doc.text('Invoice / فاتورة', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // إضافة رقم الطلب والتاريخ
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
  doc.text(`Date: ${formatDate(order.created_at)}`, doc.internal.pageSize.width - 20, 37, { align: 'right' });
  
  // إضافة حالة الطلب
  const statusText = getOrderStatusText(order.status);
  doc.text(`Status: ${statusText}`, doc.internal.pageSize.width - 20, 44, { align: 'right' });
  
  // إضافة بيانات العميل
  doc.setFontSize(14);
  doc.text('بيانات العميل', 20, 55);
  doc.setFontSize(12);
  doc.text(`الاسم: ${order.customer_name}`, 20, 63);
  doc.text(`رقم الهاتف: ${order.customer_phone || 'غير متوفر'}`, 20, 70);
  doc.text(`العنوان: ${order.customer_address || 'غير متوفر'}`, 20, 77);
  
  // إضافة بيانات المندوب
  doc.setFontSize(14);
  doc.text('بيانات المندوب', doc.internal.pageSize.width - 20, 55, { align: 'right' });
  doc.setFontSize(12);
  doc.text(`الاسم: ${salesRep?.name || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 63, { align: 'right' });
  doc.text(`رقم الهاتف: ${salesRep?.phone || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 70, { align: 'right' });
  doc.text(`البريد الإلكتروني: ${salesRep?.email || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 77, { align: 'right' });
  
  // إضافة جدول المنتجات
  doc.setFontSize(14);
  doc.text('تفاصيل المنتجات', doc.internal.pageSize.width / 2, 90, { align: 'center' });
  
  // إعداد بيانات الجدول
  const tableHeaders = [['#', 'الوصف', 'الكمية', 'سعر الوحدة', 'المجموع']];
  const tableData = products.map((product, index) => [
    index + 1,
    product.name || product.description,
    product.quantity,
    formatCurrency(product.price),
    formatCurrency(product.total)
  ]);
  
  // إضافة الجدول باستخدام الدالة المستوردة مباشرة
  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: 95,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      halign: 'center',
      valign: 'middle',
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
    },
  });
  
  // الحصول على موضع Y بعد الجدول
  const finalY = doc.lastAutoTable.finalY + 10;
  
  // إضافة ملاحظات المنتجات إذا وجدت
  let currentY = finalY;
  let hasNotes = false;
  
  products.forEach((product, index) => {
    if (product.notes) {
      if (!hasNotes) {
        doc.setFontSize(12);
        doc.text('ملاحظات المنتجات:', 20, currentY);
        currentY += 7;
        hasNotes = true;
      }
      
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${product.description}: ${product.notes}`, 25, currentY);
      currentY += 7;
    }
  });
  
  // إضافة ملاحظات الطلب إذا وجدت
  if (order.notes) {
    currentY += 5;
    doc.setFontSize(12);
    doc.text('ملاحظات الطلب:', 20, currentY);
    currentY += 7;
    doc.setFontSize(10);
    doc.text(order.notes, 25, currentY);
    currentY += 10;
  }
  
  // إضافة ملخص الطلب
  currentY = Math.max(currentY + 5, finalY + 20);
  
  doc.setFontSize(12);
  doc.text('ملخص الطلب', doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  currentY += 7;
  
  doc.text(`المجموع الفرعي: ${formatCurrency(order.subtotal)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  currentY += 7;
  
  // إظهار الضريبة فقط إذا كانت أكبر من صفر
  if (order.tax_rate > 0 && order.tax_amount > 0) {
    doc.text(`قيمة الضريبة (${order.tax_rate}%): ${formatCurrency(order.tax_amount)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
    currentY += 7;
  }
  
  doc.setFontSize(14);
  doc.text(`الإجمالي: ${formatCurrency(order.total)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  
  // إضافة تذييل الصفحة
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`الصفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text('نظام إدارة الطلبات', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  return doc;
};


/**
 * توليد ملف PDF من عنصر HTML
 * @param {string} elementId - معرف العنصر HTML
 * @param {Object} options - خيارات التصدير
 * @returns {Promise<void>}
 */
export const createPdfFromElement = async (elementId, options = {}) => {
  try {
    // استيراد المكتبات اللازمة
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    
    // العثور على العنصر بواسطة المعرف
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`لم يتم العثور على العنصر بالمعرف "${elementId}"`);
    }
    
    // إعداد خيارات html2canvas
    const canvasOptions = {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    };
    
    // تحويل العنصر إلى canvas
    const canvas = await html2canvas(element, canvasOptions);
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // حساب أبعاد PDF
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // إنشاء مستند PDF
    const orientation = options.orientation || 'landscape';
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: orientation === 'landscape' ? [imgWidth, imgHeight] : [imgHeight, imgWidth]
    });
    
    // إضافة الصورة إلى PDF
    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    
    // حفظ الملف
    const filename = options.filename || 'report.pdf';
    pdf.save(filename);
    
    return pdf;
  } catch (error) {
    console.error('خطأ في توليد PDF:', error);
    throw new Error(`فشل في توليد PDF: ${error.message}`);
  }
};

/**
 * توليد تقرير PDF مخصص للتقارير
 * @param {Array} reportData - بيانات التقرير
 * @param {Object} summary - ملخص التقرير
 * @param {Object} filters - فلاتر التقرير
 * @returns {Promise<void>}
 */
export const generateReportPDF = async (reportData, summary, filters) => {
  try {
    // إنشاء مستند PDF (الخط مسجل بالفعل في الأعلى)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // إعداد الخط العربي
    doc.setFont('helvetica');
    
    // إضافة عنوان التقرير
    doc.setFontSize(20);
    doc.text('تقرير المبيعات', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // إضافة تاريخ التقرير
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString('ar-SA');
    doc.text(`تاريخ التقرير: ${currentDate}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
    
    // إضافة فلاتر التقرير
    let yPosition = 40;
    doc.setFontSize(10);
    
    if (filters.dateFrom || filters.dateTo) {
      const dateRange = `الفترة: ${filters.dateFrom || 'البداية'} إلى ${filters.dateTo || 'النهاية'}`;
      doc.text(dateRange, 20, yPosition);
      yPosition += 7;
    }
    
    if (filters.status) {
      doc.text(`الحالة: ${getOrderStatusText(filters.status)}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (filters.userId) {
      doc.text(`المستخدم: ${filters.userName || 'محدد'}`, 20, yPosition);
      yPosition += 7;
    }
    
    yPosition += 10;
    
    // إضافة ملخص التقرير
    doc.setFontSize(14);
    doc.text('ملخص التقرير', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`إجمالي الطلبات: ${summary.totalOrders}`, 20, yPosition);
    doc.text(`إجمالي المبيعات: ${formatCurrency(summary.totalSales)}`, 80, yPosition);
    yPosition += 7;
    
    doc.text(`متوسط قيمة الطلب: ${formatCurrency(summary.averageOrderValue)}`, 20, yPosition);
    doc.text(`أعلى قيمة طلب: ${formatCurrency(summary.highestOrderValue)}`, 80, yPosition);
    yPosition += 15;
    
    // إعداد بيانات الجدول
    const tableHeaders = [
      ['رقم الطلب', 'اسم العميل', 'التاريخ', 'الحالة', 'المبلغ الإجمالي']
    ];
    
    const tableData = reportData.map(order => [
      `#${order.id}`,
      order.customer_name,
      formatDate(order.created_at),
      getOrderStatusText(order.status),
      formatCurrency(order.total)
    ]);
    
    // إضافة الجدول باستخدام الدالة المستوردة مباشرة
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 35 }
      },
      margin: { top: 10, right: 20, bottom: 20, left: 20 }
    });
    
    // إضافة تذييل الصفحة
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `الصفحة ${i} من ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'نظام إدارة الطلبات',
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 5,
        { align: 'center' }
      );
    }
    
    // توليد اسم الملف
    const dateFrom = filters.dateFrom || 'all';
    const dateTo = filters.dateTo || 'all';
    const filename = `sales-report-${dateFrom}-to-${dateTo}.pdf`;
    
    // حفظ الملف
    doc.save(filename);
    
    return doc;
  } catch (error) {
    console.error('خطأ في توليد تقرير PDF:', error);
    throw new Error(`فشل في توليد تقرير PDF: ${error.message}`);
  }
};

