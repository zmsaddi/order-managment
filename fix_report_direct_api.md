# تقرير إصلاح مشكلة الجلسات في نظام إدارة الطلبات

## المشكلة

بعد إضافة مستخدم جديد، يجب على المستخدم الحالي (المدير أو مدير المبيعات) مسح بيانات التصفح وتسجيل الدخول مرة أخرى لاستخدام الموقع.

## سبب المشكلة

بعد تحليل الكود، تبين أن المشكلة تكمن في طريقة إنشاء المستخدمين الجدد في ملف `auth.service.js`. عند إضافة مستخدم جديد، يتم استخدام نفس عميل Supabase الذي يستخدم للجلسة الحالية، مما يؤدي إلى تداخل بين جلسة المستخدم الحالي وعملية إنشاء المستخدم الجديد.

## الحل المنفذ

تم تنفيذ حل بسيط وفعال يتجنب استخدام خدمة المصادقة المعقدة:

1. **تعديل واجهة المستخدم**: تم تعديل ملف `UsersView.vue` للتعامل مباشرة مع Supabase API بدلاً من استخدام خدمة المصادقة.

2. **إضافة خطوات تحديث الجلسة**: تم إضافة خطوات لتحديث بيانات المستخدم الحالي في localStorage بعد كل عملية إضافة أو تعديل أو حذف.

3. **تبسيط منطق إدارة المستخدمين**: تم تبسيط منطق إدارة المستخدمين بحيث يتم التعامل مع كل عملية بشكل مستقل عن الجلسة الحالية.

## التغييرات التقنية

### 1. تعديل دالة إضافة المستخدم في UsersView.vue:

```javascript
// إضافة مستخدم جديد مباشرة باستخدام Supabase API
const addUserDirectly = async () => {
  submitting.value = true
  
  try {
    // التحقق من صلاحيات المستخدم الحالي
    if (!['admin', 'sales_manager'].includes(user.value.role)) {
      throw new Error('ليس لديك صلاحية لإضافة مستخدمين جدد')
    }

    // 1. إنشاء المستخدم في نظام المصادقة
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUser.value.email,
      password: newUser.value.password,
      options: {
        data: {
          name: newUser.value.name,
          role: newUser.value.role
        }
      }
    })

    if (authError) throw authError

    // 2. إنشاء سجل المستخدم في جدول المستخدمين
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: newUser.value.email,
          name: newUser.value.name,
          role: newUser.value.role,
          phone: newUser.value.phone,
          status: 'active'
        }
      ])
      .select()
      .single()

    if (userError) throw userError

    // 3. إعادة تأكيد جلسة المستخدم الحالي
    const { data: sessionData } = await supabase.auth.getSession()
    
    // 4. إعادة تحميل بيانات المستخدم الحالي من قاعدة البيانات
    if (sessionData && sessionData.session) {
      const { data: currentUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      if (currentUserData) {
        // تحديث بيانات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify(currentUserData))
        user.value = currentUserData
      }
    }

    // إغلاق النافذة وإعادة تحميل المستخدمين
    closeAddUserModal()
    await fetchUsers()
    
    alert('تم إضافة المستخدم بنجاح')
  } catch (error) {
    console.error('خطأ في إضافة المستخدم:', error)
    alert('حدث خطأ أثناء إضافة المستخدم: ' + (error.message || 'خطأ غير معروف'))
  } finally {
    submitting.value = false
  }
}
```

### 2. تعديل دالة تحديث المستخدم في UsersView.vue:

```javascript
// تحديث المستخدم مباشرة باستخدام Supabase API
const updateUserDirectly = async () => {
  submitting.value = true
  
  try {
    // التحقق من صلاحيات المستخدم الحالي
    if (!['admin', 'sales_manager'].includes(user.value.role) && user.value.id !== editingUser.value.id) {
      throw new Error('ليس لديك صلاحية لتحديث بيانات هذا المستخدم')
    }

    // 1. تحديث بيانات المستخدم في جدول المستخدمين
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: editingUser.value.name,
        phone: editingUser.value.phone,
        role: editingUser.value.role,
        status: editingUser.value.status,
        updated_at: new Date()
      })
      .eq('id', editingUser.value.id)

    if (updateError) throw updateError

    // 2. إذا تم إدخال كلمة مرور جديدة، قم بتحديثها
    if (editingUser.value.password && editingUser.value.password.length >= 6) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        editingUser.value.id,
        { password: editingUser.value.password }
      )
      
      if (passwordError) throw passwordError
    }

    // 3. إعادة تأكيد جلسة المستخدم الحالي
    const { data: sessionData } = await supabase.auth.getSession()
    
    // 4. إذا كان المستخدم يقوم بتحديث بياناته الشخصية، قم بتحديث localStorage
    if (user.value.id === editingUser.value.id && sessionData && sessionData.session) {
      const { data: currentUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      if (currentUserData) {
        // تحديث بيانات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify(currentUserData))
        user.value = currentUserData
      }
    }

    // إغلاق النافذة وإعادة تحميل المستخدمين
    closeEditUserModal()
    await fetchUsers()
    
    alert('تم تحديث المستخدم بنجاح')
  } catch (error) {
    console.error('خطأ في تحديث المستخدم:', error)
    alert('حدث خطأ أثناء تحديث المستخدم: ' + (error.message || 'خطأ غير معروف'))
  } finally {
    submitting.value = false
  }
}
```

### 3. تعديل دالة حذف المستخدم في UsersView.vue:

```javascript
// حذف المستخدم مباشرة باستخدام Supabase API
const deleteUserDirectly = async () => {
  if (!userToDelete.value) return
  
  deleting.value = true
  
  try {
    // التحقق من صلاحيات المستخدم الحالي
    if (!['admin', 'sales_manager'].includes(user.value.role)) {
      throw new Error('ليس لديك صلاحية لحذف المستخدمين')
    }

    // التحقق من أن المستخدم ليس مديراً عاماً
    if (userToDelete.value.role === 'admin') {
      throw new Error('لا يمكن حذف المدير العام')
    }

    // التحقق من أن مدير المبيعات لا يحاول حذف مدير مبيعات آخر
    if (user.value.role === 'sales_manager' && userToDelete.value.role === 'sales_manager') {
      throw new Error('لا يمكن لمدير المبيعات حذف مدير مبيعات آخر')
    }

    // 1. حذف سجل المستخدم من جدول المستخدمين
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.value.id)

    if (error) throw error

    // 2. إعادة تأكيد جلسة المستخدم الحالي
    const { data: sessionData } = await supabase.auth.getSession()
    
    // 3. إعادة تحميل بيانات المستخدم الحالي من قاعدة البيانات
    if (sessionData && sessionData.session) {
      const { data: currentUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      if (currentUserData) {
        // تحديث بيانات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify(currentUserData))
        user.value = currentUserData
      }
    }

    // إغلاق النافذة وإعادة تحميل المستخدمين
    closeDeleteModal()
    await fetchUsers()
    
    alert('تم حذف المستخدم بنجاح')
  } catch (error) {
    console.error('خطأ في حذف المستخدم:', error)
    alert('حدث خطأ أثناء حذف المستخدم: ' + (error.message || 'خطأ غير معروف'))
  } finally {
    deleting.value = false
  }
}
```

## النتائج المتوقعة

بعد تطبيق هذه التعديلات:

1. يمكن للمدير أو مدير المبيعات إضافة مستخدمين جدد دون الحاجة لمسح بيانات التصفح أو إعادة تسجيل الدخول.
2. تستمر الجلسة الحالية بشكل طبيعي بعد إضافة أو تعديل أو حذف المستخدمين.
3. تحسين تجربة المستخدم وتقليل الإزعاج الناتج عن فقدان الجلسة.

## مميزات الحل

1. **بساطة التنفيذ**: الحل يعتمد على تعديل ملف واحد فقط (UsersView.vue) دون الحاجة لتغييرات معقدة في بنية النظام.

2. **استقلالية عن خدمة المصادقة**: تم تجنب استخدام خدمة المصادقة المعقدة والتعامل مباشرة مع Supabase API.

3. **تحديث فوري للبيانات**: يتم تحديث بيانات المستخدم الحالي في localStorage بعد كل عملية، مما يضمن استمرارية الجلسة.

4. **تحسين تجربة المستخدم**: لا يحتاج المستخدم لمسح بيانات التصفح أو إعادة تسجيل الدخول بعد إضافة أو تعديل أو حذف المستخدمين.
