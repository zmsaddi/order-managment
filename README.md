# نظام إدارة الطلبات - النسخة المصححة

هذه النسخة المصححة من نظام إدارة الطلبات تعالج مشكلة عدم عمل الموقع على الكمبيوتر بينما يعمل على الهاتف المحمول، وتحل مشكلة عدم استجابة زر تسجيل الدخول.

## الإصلاحات الرئيسية

1. **تصحيح إعدادات التوجيه**: تم تعديل ملف router/index.js لاستخدام `createWebHashHistory` بدلاً من `createWebHistory`
2. **توحيد استخدام إعدادات Supabase**: تم تعديل جميع الخدمات لاستخدام ملف config.js للاتصال بـ Supabase
3. **تحديث بيانات الاتصال**: تم تحديث بيانات الاتصال بـ Supabase لاستخدام مشروع جديد
4. **تحسين vite.config.js**: تمت إضافة خاصية `base: './'` لضمان تحميل الموارد بشكل صحيح

## إعداد مشروع Supabase جديد

### 1. إنشاء مشروع Supabase

1. انتقل إلى موقع [Supabase](https://supabase.com/)
2. قم بتسجيل الدخول أو إنشاء حساب جديد
3. اضغط على زر "New Project"
4. أدخل اسم المشروع (مثلاً "Order-managment")
5. أدخل كلمة مرور لقاعدة البيانات (مثلاً "BpkE3WrNBjTW.CD")
6. اختر المنطقة الأقرب إليك جغرافياً
7. اضغط على "Create new project"

### 2. الحصول على بيانات الاتصال

1. بعد إنشاء المشروع، انتقل إلى قسم "Settings" ثم "API"
2. ستجد هناك "Project URL" (مثلاً "https://mrocuyajltnvhiiigwqb.supabase.co")
3. ستجد أيضاً "anon public" API key (مثلاً "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yb2N1eWFqbHRudmhpaWlnd3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk4NTQsImV4cCI6MjA2NDU2NTg1NH0.zzFEJKO6rHm5GypGR4QSFBFMwCBibdgOlkzL5V08Rf4")

### 3. تحديث ملف config.js

قم بتحديث ملف `src/config.js` ببيانات الاتصال الجديدة:

```javascript
// تكوين متغيرات البيئة لـ Supabase
export const config = {
  supabaseUrl: 'https://mrocuyajltnvhiiigwqb.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yb2N1eWFqbHRudmhpaWlnd3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk4NTQsImV4cCI6MjA2NDU2NTg1NH0.zzFEJKO6rHm5GypGR4QSFBFMwCBibdgOlkzL5V08Rf4'
}
```

### 4. إعداد قاعدة البيانات

1. انتقل إلى قسم "SQL Editor" في لوحة تحكم Supabase
2. اضغط على "New Query"
3. انسخ والصق كود SQL التالي:

```sql
-- إعداد قاعدة بيانات نظام إدارة الطلبات

-- إنشاء الامتدادات اللازمة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'representative', -- 'admin', 'sales_manager', 'representative'
  employee_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  product_description TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'completed_pending_delivery', 'delivered', 'cancelled'
  sales_rep_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول منتجات الطلبات
CREATE TABLE IF NOT EXISTS public.order_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل سياسات الأمان على مستوى الصفوف
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة إن وجدت
DROP POLICY IF EXISTS users_select_policy ON public.users;
DROP POLICY IF EXISTS users_insert_policy ON public.users;
DROP POLICY IF EXISTS users_update_policy ON public.users;
DROP POLICY IF EXISTS users_delete_policy ON public.users;
DROP POLICY IF EXISTS orders_select_policy ON public.orders;
DROP POLICY IF EXISTS orders_insert_policy ON public.orders;
DROP POLICY IF EXISTS orders_update_policy ON public.orders;
DROP POLICY IF EXISTS orders_delete_policy ON public.orders;
DROP POLICY IF EXISTS order_products_select_policy ON public.order_products;
DROP POLICY IF EXISTS order_products_insert_policy ON public.order_products;
DROP POLICY IF EXISTS order_products_update_policy ON public.order_products;
DROP POLICY IF EXISTS order_products_delete_policy ON public.order_products;

-- سياسات جدول المستخدمين
-- سياسة قراءة المستخدمين (للمستخدمين المصادق عليهم)
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- سياسة إدخال المستخدمين (للمدراء أو المستخدم نفسه عند أول تسجيل دخول)
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    (
      -- السماح للمستخدم بإدراج نفسه (عند أول تسجيل دخول)
      id = auth.uid() OR
      -- أو السماح للمدراء بإدراج مستخدمين جدد
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      )
    )
  );

-- سياسة تحديث المستخدمين (للمدراء أو المستخدم نفسه)
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    (
      id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
      ) OR
      (
        EXISTS (
          SELECT 1 FROM public.users 
          WHERE id = auth.uid() AND role = 'sales_manager'
        ) AND
        (
          SELECT role FROM public.users WHERE id = users.id
        ) NOT IN ('admin', 'sales_manager')
      )
    )
  );

-- سياسة حذف المستخدمين (للمدراء فقط، مع قيود إضافية لمدير المبيعات)
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
      ) OR
      (
        EXISTS (
          SELECT 1 FROM public.users 
          WHERE id = auth.uid() AND role = 'sales_manager'
        ) AND
        (
          SELECT role FROM public.users WHERE id = users.id
        ) = 'representative'
      )
    )
  );

-- سياسات جدول الطلبات
-- سياسة قراءة الطلبات (للمدراء: جميع الطلبات، للمندوبين: طلباتهم فقط)
CREATE POLICY "orders_select_policy" ON public.orders
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    (
      sales_rep_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      )
    )
  );

-- سياسة إدخال الطلبات (للمستخدمين المصادق عليهم)
CREATE POLICY "orders_insert_policy" ON public.orders
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
  );

-- سياسة تحديث الطلبات (للمدراء أو مندوب المبيعات المسؤول)
CREATE POLICY "orders_update_policy" ON public.orders
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    (
      sales_rep_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      )
    )
  );

-- سياسة حذف الطلبات (للمدراء فقط)
CREATE POLICY "orders_delete_policy" ON public.orders
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
    )
  );

-- سياسات جدول منتجات الطلبات
-- سياسة قراءة منتجات الطلبات
CREATE POLICY "order_products_select_policy" ON public.order_products
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      ) OR
      EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_products.order_id AND orders.sales_rep_id = auth.uid()
      )
    )
  );

-- سياسة إدخال منتجات الطلبات
CREATE POLICY "order_products_insert_policy" ON public.order_products
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      ) OR
      EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_products.order_id AND orders.sales_rep_id = auth.uid()
      )
    )
  );

-- سياسة تحديث منتجات الطلبات
CREATE POLICY "order_products_update_policy" ON public.order_products
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      ) OR
      EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_products.order_id AND orders.sales_rep_id = auth.uid()
      )
    )
  );

-- سياسة حذف منتجات الطلبات
CREATE POLICY "order_products_delete_policy" ON public.order_products
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'sales_manager')
      ) OR
      EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_products.order_id AND orders.sales_rep_id = auth.uid()
      )
    )
  );

-- إنشاء وظيفة لحساب إجماليات الطلب تلقائياً
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- حساب مبلغ الضريبة
  NEW.tax_amount := NEW.subtotal * (NEW.tax_rate / 100);
  
  -- حساب الإجمالي
  NEW.total := NEW.subtotal + NEW.tax_amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفز لتطبيق وظيفة حساب الإجماليات
DROP TRIGGER IF EXISTS calculate_order_totals_trigger ON public.orders;
CREATE TRIGGER calculate_order_totals_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION calculate_order_totals();

-- إنشاء وظيفة لحساب إجماليات منتجات الطلب
CREATE OR REPLACE FUNCTION calculate_product_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  -- حساب المجموع الفرعي للمنتج
  NEW.subtotal := NEW.quantity * NEW.unit_price;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفز لتطبيق وظيفة حساب إجماليات المنتجات
DROP TRIGGER IF EXISTS calculate_product_subtotal_trigger ON public.order_products;
CREATE TRIGGER calculate_product_subtotal_trigger
BEFORE INSERT OR UPDATE ON public.order_products
FOR EACH ROW
EXECUTE FUNCTION calculate_product_subtotal();

-- إنشاء وظيفة لتحديث وقت التعديل تلقائياً
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفزات لتحديث وقت التعديل
DROP TRIGGER IF EXISTS update_users_timestamp ON public.users;
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp();

DROP TRIGGER IF EXISTS update_orders_timestamp ON public.orders;
CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp();

-- ======== إضافة وظيفة التفعيل التلقائي للمستخدمين ========

-- وظيفة لتفعيل المستخدمين تلقائياً عند إنشائهم
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- تحديث حالة المستخدم في جدول auth.users لتكون مفعلة
  -- نقوم بتحديث email_confirmed_at فقط لأن confirmed_at هو عمود مولّد
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- حذف المحفز إن وجد
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

-- إنشاء محفز لتفعيل المستخدمين تلقائياً عند إنشائهم
CREATE TRIGGER auto_confirm_user_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_confirm_user();

-- منح صلاحيات تنفيذ الوظائف
GRANT EXECUTE ON FUNCTION auto_confirm_user() TO service_role;

-- تفعيل المستخدمين الحاليين الذين لم يتم تفعيلهم بعد
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
```

4. اضغط على "Run" لتنفيذ الكود

### 5. إنشاء المستخدم المدير الافتراضي

1. انتقل إلى قسم "Authentication" ثم "Users"
2. اضغط على "Add User"
3. أدخل بريد إلكتروني وكلمة مرور للمستخدم المدير
4. بعد إنشاء المستخدم، سيتم تفعيله تلقائياً بواسطة المحفز الذي تم إنشاؤه

## كيفية الاستخدام

### التطوير المحلي

1. قم بتثبيت الحزم:
```
npm install
```

2. تشغيل خادم التطوير:
```
npm run dev
```

### البناء للإنتاج

1. بناء المشروع:
```
npm run build
```

### النشر على Vercel

1. قم برفع المشروع إلى GitHub.
2. قم بربط المستودع بـ Vercel.
3. تأكد من وجود ملف `vercel.json` في المستودع.

### النشر على GitHub Pages

1. قم بتنفيذ سكريبت النشر:
```
./deploy.sh
```

## استكشاف الأخطاء وإصلاحها

إذا واجهت مشاكل في تسجيل الدخول، تأكد من:

1. صحة بيانات الاتصال في ملف `src/config.js`
2. وجود مستخدم نشط في قاعدة البيانات
3. تنفيذ جميع أوامر SQL بنجاح
4. تفعيل المستخدمين في جدول auth.users
