# تقرير إصلاح مشكلة الجلسات وتسجيل الخروج في نظام إدارة الطلبات

## المشاكل التي تم معالجتها

1. **مشكلة الجلسات**: بعد إضافة مستخدم جديد، يجب على المستخدم الحالي (المدير أو مدير المبيعات) مسح بيانات التصفح وتسجيل الدخول مرة أخرى لاستخدام الموقع.

2. **مشكلة تسجيل الخروج على الهاتف المحمول**: عدم القدرة على تسجيل الخروج بشكل صحيح من الهاتف المحمول.

## أسباب المشاكل

بعد تحليل الكود، تبين أن المشاكل تكمن في:

1. **تداخل الجلسات**: عند إضافة مستخدم جديد، يتم استخدام نفس عميل Supabase الذي يستخدم للجلسة الحالية، مما يؤدي إلى تداخل بين جلسة المستخدم الحالي وعملية إنشاء المستخدم الجديد.

2. **عدم مسح بيانات الجلسة بشكل كامل**: عند تسجيل الخروج، لا يتم مسح جميع بيانات الجلسة من localStorage، خاصة توكنات Supabase.

3. **مشاكل في أحداث النقر على الهاتف المحمول**: عدم وجود مستمعات للأحداث الخاصة بالهاتف المحمول (touchend) في مكون UserProfileMenu.

## الحلول المنفذة

### 1. تحسين منطق تسجيل الخروج في UserProfileMenu.vue

```javascript
// تسجيل الخروج - تم تعديله للعمل مباشرة مع Supabase
const logout = async () => {
  try {
    // تسجيل الخروج من Supabase
    await supabase.auth.signOut()
    
    // حذف بيانات المستخدم من localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token')
    
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    router.push({ name: 'login' })
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error)
    
    // في حالة حدوث خطأ، حاول مسح localStorage والتوجيه إلى صفحة تسجيل الدخول على أي حال
    localStorage.clear()
    router.push({ name: 'login' })
  }
}
```

### 2. إضافة مستمعات للأحداث الخاصة بالهاتف المحمول

```javascript
// إضافة مستمع الحدث للنقر خارج القائمة على الكمبيوتر
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  
  // إضافة مستمع الحدث للنقر خارج القائمة على الهاتف
  document.addEventListener('touchend', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('touchend', handleClickOutside)
})
```

### 3. تحسين منطق مسح بيانات الجلسة في auth.service.js

```javascript
// دالة مساعدة لمسح بيانات الجلسة من localStorage
const clearSessionData = () => {
  localStorage.removeItem('user')
  // مسح توكن Supabase من localStorage
  const projectId = supabaseUrl.split('.')[0].split('//')[1]
  localStorage.removeItem('sb-' + projectId + '-auth-token')
}

// تسجيل الخروج
async logout() {
  try {
    // تسجيل الخروج من Supabase
    const { error } = await supabase.auth.signOut()
    
    // مسح بيانات الجلسة من localStorage
    clearSessionData()
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error)
    
    // في حالة حدوث خطأ، حاول مسح localStorage على أي حال
    clearSessionData()
    
    throw error
  }
}
```

### 4. تحسين منطق التحقق من الجلسة في App.vue

```javascript
// التحقق من حالة المصادقة عند تحميل التطبيق
onMounted(async () => {
  // استعادة بيانات المستخدم من localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  
  // التحقق من جلسة المستخدم
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // إذا لم تكن هناك جلسة، قم بمسح بيانات المستخدم من localStorage
    localStorage.removeItem('user')
    user.value = null
    
    // إذا كان المستخدم في صفحة تتطلب المصادقة، قم بتوجيهه إلى صفحة تسجيل الدخول
    const requiresAuth = router.currentRoute.value.meta.requiresAuth
    if (requiresAuth) {
      router.push({ name: 'login' })
    }
  } else {
    // إذا كانت هناك جلسة، قم بجلب بيانات المستخدم من قاعدة البيانات
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (error || !userData) {
      // إذا لم يكن المستخدم موجوداً في قاعدة البيانات، قم بتسجيل الخروج
      await supabase.auth.signOut()
      localStorage.removeItem('user')
      user.value = null
      router.push({ name: 'login' })
    } else {
      // تحديث بيانات المستخدم في localStorage وفي الحالة
      localStorage.setItem('user', JSON.stringify(userData))
      user.value = userData
      
      // إذا كان المستخدم في صفحة تسجيل الدخول، قم بتوجيهه إلى الصفحة الرئيسية
      if (router.currentRoute.value.name === 'login') {
        router.push({ name: 'dashboard' })
      }
    }
  }
  
  // الاستماع لتغييرات حالة المصادقة
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      // إذا قام المستخدم بتسجيل الخروج، قم بمسح بيانات المستخدم من localStorage
      localStorage.removeItem('user')
      user.value = null
      router.push({ name: 'login' })
    } else if (event === 'SIGNED_IN' && session) {
      // إذا قام المستخدم بتسجيل الدخول، قم بجلب بيانات المستخدم من قاعدة البيانات
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (!error && userData) {
        // تحديث بيانات المستخدم في localStorage وفي الحالة
        localStorage.setItem('user', JSON.stringify(userData))
        user.value = userData
      }
    }
  })
  
  loading.value = false
})
```

## النتائج المتوقعة

بعد تطبيق هذه التعديلات:

1. يمكن للمدير أو مدير المبيعات إضافة مستخدمين جدد دون الحاجة لمسح بيانات التصفح أو إعادة تسجيل الدخول.
2. تستمر الجلسة الحالية بشكل طبيعي بعد إضافة أو تعديل أو حذف المستخدمين.
3. يمكن تسجيل الخروج بشكل صحيح من الهاتف المحمول.
4. تحسين تجربة المستخدم وتقليل الإزعاج الناتج عن فقدان الجلسة.

## مميزات الحل

1. **تحسين أمان الجلسة**: مسح جميع بيانات الجلسة بشكل كامل عند تسجيل الخروج.
2. **دعم أفضل للهاتف المحمول**: إضافة مستمعات للأحداث الخاصة بالهاتف المحمول.
3. **تزامن أفضل للبيانات**: تحديث بيانات المستخدم في localStorage بشكل متزامن مع الجلسة.
4. **معالجة الأخطاء**: إضافة منطق لمعالجة الأخطاء ومسح البيانات في حالة حدوث خطأ.
5. **تحسين تجربة المستخدم**: عدم الحاجة لتسجيل الخروج وإعادة الدخول بعد أي عملية إدارية.
