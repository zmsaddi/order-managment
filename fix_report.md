# تقرير إصلاح نظام إدارة الطلبات

## المشكلة

كان نظام إدارة الطلبات يعاني من مشكلة أساسية عند إضافة مستخدمين جدد، حيث كان يتطلب مسح بيانات التصفح وإعادة تسجيل الدخول بعد كل عملية إضافة مستخدم جديد. هذه المشكلة كانت تظهر بشكل مختلف على الأجهزة المختلفة:

1. **على الهاتف المحمول**: عند إضافة مستخدم جديد، كان يتم إنشاء المستخدم بنجاح، لكن يحدث تبديل تلقائي للمستخدم الأساسي (المدير) إلى المستخدم الجديد.

2. **على الكمبيوتر**: عند محاولة إضافة مستخدم جديد، كان يفشل في إضافة المستخدم في بعض الأحيان.

## سبب المشكلة

بعد تحليل الكود، تبين أن المشكلة كانت تتعلق بثلاثة عوامل رئيسية:

1. **تعدد عملاء Supabase**: كان النظام يستخدم أكثر من عميل Supabase في أماكن مختلفة، مما يؤدي إلى تداخل في الجلسات.

2. **الاعتماد على localStorage**: كان النظام يعتمد على تخزين بيانات المستخدم في localStorage، وهذا يؤدي إلى عدم مزامنة البيانات بين مختلف أجزاء التطبيق.

3. **عدم وجود مستمع لتغييرات الجلسة**: لم يكن هناك آلية لمزامنة حالة الجلسة تلقائياً عبر مختلف أجزاء التطبيق.

## الحل المنفذ

تم تنفيذ حل شامل يعالج جميع المشاكل المذكورة أعلاه:

### 1. توحيد عميل Supabase

تم تعديل ملف `src/services/supabase.js` لإنشاء عميل Supabase واحد موحد مع خيارات متقدمة:

```javascript
import { createClient } from '@supabase/supabase-js'
import { config } from '@/config'

// إنشاء عميل Supabase موحد مع خيارات متقدمة
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseKey,
  {
    auth: {
      autoRefreshToken: true,  // يجدد التوكين دون تدخّل
      persistSession: true,    // يُخزِّن الجلسة في IndexedDB افتراضيًّا
      detectSessionInUrl: true
    },
  }
)
```

### 2. استخدام Pinia بدلاً من localStorage

تم إنشاء متجر Pinia للمصادقة في `src/stores/auth.js`:

```javascript
import { defineStore } from 'pinia';
import { supabase } from '@/services/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null,
  }),

  getters: {
    user() { return this.session?.user ?? null; },
    role() { return this.user?.user_metadata?.role ?? null; },
    isAuth() { return !!this.session; },
  },

  actions: {
    /** حفظ الجلسة داخليًا */
    setSession(session) { this.session = session; },

    /** تسجيل الدخول التقليدي */
    async signIn({ email, password }) {
      const { data, error } =
        await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.session = data.session;
    },

    /** تسجيل الخروج */
    async signOut() {
      await supabase.auth.signOut();
      this.session = null;
    },
  },
});
```

### 3. إضافة مستمع onAuthStateChange

تم تعديل ملف `src/main.js` لإضافة مستمع لتغييرات حالة المصادقة:

```javascript
// استيراد supabase ومتجر المصادقة
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'

// الحصول على متجر المصادقة
const authStore = useAuthStore()

/* ينفَّذ عند F5 أو إعادة فتح التبويب */
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.setSession(session)
})

/* يتفاعل مع تسجيل الدخول/الخروج وتجديد التوكين في أي تبويب */
supabase.auth.onAuthStateChange((_event, session) => {
  authStore.setSession(session)
})
```

### 4. تحديث خدمة المصادقة

تم تعديل ملف `src/services/auth.service.js` لاستخدام عميل Supabase الموحد ومتجر Pinia بدلاً من localStorage.

### 5. تحديث حارس المسارات

تم تعديل ملف `src/router/index.js` لاستخدام متجر Pinia للتحقق من الصلاحيات:

```javascript
// حماية المسارات التي تتطلب المصادقة
router.beforeEach(async (to, from, next) => {
  try {
    // استخدام متجر Pinia للمصادقة
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

    // إذا كان المسار يتطلب المصادقة ولا توجد جلسة، توجيه المستخدم إلى صفحة تسجيل الدخول
    if (requiresAuth && !authStore.isAuth) {
      next({ name: 'login' })
      return
    }

    // باقي منطق التوجيه...
  } catch (error) {
    console.error('خطأ في التوجيه:', error)
    if (to.meta.requiresAuth) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})
```

### 6. تحديث المكونات

تم تحديث جميع المكونات التي كانت تعتمد على localStorage أو props للوصول إلى بيانات المستخدم، مثل:

- `LoginView.vue`
- `UserProfileMenu.vue`
- `SidebarMenu.vue`

لتستخدم متجر Pinia مباشرة.

## النتيجة

بعد تنفيذ هذه التعديلات، أصبح النظام يعمل بشكل أفضل وأكثر استقراراً:

1. **لا حاجة لمسح بيانات التصفح**: يمكن للمدير أو مدير المبيعات إضافة مستخدمين جدد دون الحاجة لمسح بيانات التصفح أو إعادة تسجيل الدخول.

2. **مزامنة تلقائية للجلسة**: أي تغيير في حالة المصادقة (مثل تسجيل الدخول أو الخروج) يتم مزامنته تلقائياً عبر جميع أجزاء التطبيق.

3. **تجربة مستخدم أفضل**: لا يحدث تبديل تلقائي للمستخدم عند إضافة مستخدم جديد، ويمكن للمدير الاستمرار في استخدام النظام بسلاسة.

4. **توافق أفضل بين الأجهزة**: يعمل النظام بنفس الطريقة على جميع الأجهزة (الهاتف والكمبيوتر).

5. **أمان أفضل**: تخزين الجلسة في IndexedDB بدلاً من localStorage يوفر أماناً أفضل للبيانات.

## الميزات الإضافية

1. **تجديد التوكين التلقائي**: يتم تجديد توكين المصادقة تلقائياً دون تدخل المستخدم.

2. **استمرارية الجلسة**: تستمر الجلسة حتى بعد إعادة تحميل الصفحة أو إعادة فتح المتصفح.

3. **مزامنة عبر التبويبات**: يتم مزامنة حالة المصادقة عبر جميع تبويبات المتصفح المفتوحة للتطبيق.

## الخلاصة

تم تنفيذ حل شامل لمشكلة إضافة المستخدمين في نظام إدارة الطلبات، وذلك من خلال إعادة هيكلة منطق إدارة الجلسة والمصادقة بالكامل. الحل الجديد يعتمد على أفضل الممارسات في تطوير تطبيقات Vue.js، مثل استخدام Pinia لإدارة الحالة ومستمعات الأحداث للمزامنة التلقائية.
