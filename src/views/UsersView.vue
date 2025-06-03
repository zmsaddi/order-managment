<template>
  <div class="min-h-screen bg-gray-50">
    <!-- القائمة الجانبية والشريط العلوي -->
    <div class="flex h-screen overflow-hidden">
      <!-- القائمة الجانبية -->
      <aside class="bg-sky-800 text-white w-64 flex-shrink-0 hidden md:block">
        <div class="p-4 border-b border-sky-700">
          <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
        </div>
        <nav class="mt-4">
          <ul class="space-y-1">
            <li>
              <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </span>
                <span>لوحة التحكم</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/users' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </span>
                <span>المستخدمين</span>
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>الطلبات</span>
              </router-link>
            </li>
            <li>
              <router-link to="/reports" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>التقارير</span>
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/profile' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>الملف الشخصي</span>
              </router-link>
            </li>
            <li>
              <button @click="logout" class="w-full flex items-center px-4 py-3 hover:bg-sky-700 transition-colors text-left">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>تسجيل الخروج</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- المحتوى الرئيسي -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- الشريط العلوي -->
        <header class="bg-white shadow-sm z-10">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center">
              <button @click="toggleSidebar" class="md:hidden ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 class="text-xl font-semibold text-gray-800">إدارة المستخدمين</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
              </div>
            </div>
          </div>
        </header>
        
        <!-- القائمة الجانبية للجوال -->
        <div v-if="showMobileSidebar" class="fixed inset-0 z-20 md:hidden">
          <div class="absolute inset-0 bg-black opacity-50" @click="toggleSidebar"></div>
          <div class="absolute inset-y-0 right-0 w-64 bg-sky-800 text-white">
            <div class="p-4 border-b border-sky-700 flex justify-between items-center">
              <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
              <button @click="toggleSidebar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav class="mt-4">
              <ul class="space-y-1">
                <li>
                  <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </span>
                    <span>لوحة التحكم</span>
                  </router-link>
                </li>
                <li v-if="isAdmin">
                  <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/users' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </span>
                    <span>المستخدمين</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/orders" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>الطلبات</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/reports" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>التقارير</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/profile" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/profile' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>الملف الشخصي</span>
                  </router-link>
                </li>
                <li>
                  <button @click="logout" class="w-full flex items-center px-4 py-3 hover:bg-sky-700 transition-colors text-left">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>تسجيل الخروج</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
            <button @click="openAddUserModal" class="btn btn-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              إضافة مستخدم جديد
            </button>
          </div>
          
          <!-- جدول المستخدمين -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 class="text-lg font-semibold text-gray-800 mb-2 md:mb-0">قائمة المستخدمين</h2>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="بحث..." 
                    class="form-input pr-8 w-full md:w-64"
                  />
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="loading" class="text-center py-8">
              <p>جاري تحميل البيانات...</p>
            </div>
            
            <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
              <p v-if="searchQuery">لا توجد نتائج مطابقة للبحث</p>
              <p v-else>لا يوجد مستخدمين</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ user.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ getRoleName(user.role) }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ getStatusName(user.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      <div class="flex space-x-2 space-x-reverse">
                        <button 
                          @click="editUser(user)" 
                          class="text-sky-600 hover:text-sky-800"
                          title="تعديل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          @click="resetPassword(user)" 
                          class="text-yellow-600 hover:text-yellow-800"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          v-if="canDeleteUser(user)" 
                          @click="confirmDeleteUser(user)" 
                          class="text-red-600 hover:text-red-800"
                          title="حذف"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    
    <!-- نافذة إضافة/تعديل مستخدم -->
    <div v-if="showUserModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeUserModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ isEditing ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}</h3>
            </div>
            
            <form @submit.prevent="saveUser">
              <div class="form-group">
                <label for="name" class="form-label">الاسم</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="userForm.name" 
                  class="form-input" 
                  placeholder="أدخل الاسم" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="userForm.email" 
                  class="form-input" 
                  placeholder="أدخل البريد الإلكتروني" 
                  required
                  :disabled="isEditing"
                />
              </div>
              
              <div v-if="!isEditing" class="form-group">
                <label for="password" class="form-label">كلمة المرور</label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="userForm.password" 
                  class="form-input" 
                  placeholder="أدخل كلمة المرور" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="role" class="form-label">الدور</label>
                <select 
                  id="role" 
                  v-model="userForm.role" 
                  class="form-input" 
                  required
                  :disabled="!canChangeRole(userForm)"
                >
                  <option value="admin" v-if="currentUser.role === 'admin'">مدير عام</option>
                  <option value="sales_manager">مدير مبيعات</option>
                  <option value="representative">مندوب</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">رقم الهاتف</label>
                <input 
                  type="text" 
                  id="phone" 
                  v-model="userForm.phone" 
                  class="form-input" 
                  placeholder="أدخل رقم الهاتف" 
                />
              </div>
              
              <div class="form-group">
                <label for="address" class="form-label">العنوان</label>
                <input 
                  type="text" 
                  id="address" 
                  v-model="userForm.address" 
                  class="form-input" 
                  placeholder="أدخل العنوان" 
                />
              </div>
              
              <div class="form-group">
                <label for="status" class="form-label">الحالة</label>
                <select 
                  id="status" 
                  v-model="userForm.status" 
                  class="form-input" 
                  required
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
              
              <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4">
                {{ errorMessage }}
              </div>
              
              <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
                <button 
                  type="button" 
                  class="btn bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  @click="closeUserModal"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="saving"
                >
                  <span v-if="saving">جاري الحفظ...</span>
                  <span v-else>حفظ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- نافذة تأكيد الحذف -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeDeleteModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 class="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    هل أنت متأكد من رغبتك في حذف المستخدم "{{ userToDelete?.name }}"؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="btn btn-danger w-full sm:w-auto sm:mr-3" 
                @click="deleteUser"
                :disabled="deleting"
              >
                <span v-if="deleting">جاري الحذف...</span>
                <span v-else>حذف</span>
              </button>
              <button 
                type="button" 
                class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                @click="closeDeleteModal"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- نافذة إعادة تعيين كلمة المرور -->
    <div v-if="showResetModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeResetModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">إعادة تعيين كلمة المرور</h3>
            </div>
            
            <form @submit.prevent="submitResetPassword">
              <div class="form-group">
                <label for="new-password" class="form-label">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  id="new-password" 
                  v-model="newPassword" 
                  class="form-input" 
                  placeholder="أدخل كلمة المرور الجديدة" 
                  required
                />
              </div>
              
              <div v-if="resetErrorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4">
                {{ resetErrorMessage }}
              </div>
              
              <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
                <button 
                  type="button" 
                  class="btn bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  @click="closeResetModal"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="resetting"
                >
                  <span v-if="resetting">جاري إعادة التعيين...</span>
                  <span v-else>تعيين كلمة المرور</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/auth.service'

export default {
  name: 'UsersView',
  setup() {
    const router = useRouter()
    const showMobileSidebar = ref(false)
    const loading = ref(true)
    const users = ref([])
    const searchQuery = ref('')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(currentUser.value.role)
    })
    
    // تصفية المستخدمين حسب البحث
    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        getRoleName(user.role).toLowerCase().includes(query)
      )
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // تسجيل الخروج
    const logout = async () => {
      try {
        await authService.logout()
        localStorage.removeItem('user')
        router.push({ name: 'login' })
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
    
    // الحصول على اسم الدور
    const getRoleName = (role) => {
      const roleMap = {
        'admin': 'مدير عام',
        'sales_manager': 'مدير مبيعات',
        'representative': 'مندوب'
      }
      return roleMap[role] || role
    }
    
    // الحصول على اسم الحالة
    const getStatusName = (status) => {
      const statusMap = {
        'active': 'نشط',
        'inactive': 'غير نشط'
      }
      return statusMap[status] || status
    }
    
    // الحصول على فئة CSS للحالة
    const getStatusClass = (status) => {
      const statusClassMap = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-red-100 text-red-800'
      }
      return statusClassMap[status] || 'bg-gray-100 text-gray-800'
    }
    
    // جلب المستخدمين
    const fetchUsers = async () => {
      try {
        loading.value = true
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        users.value = data || []
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error)
      } finally {
        loading.value = false
      }
    }
    
    // متغيرات نافذة إضافة/تعديل مستخدم
    const showUserModal = ref(false)
    const isEditing = ref(false)
    const userForm = ref({
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'representative',
      phone: '',
      address: '',
      status: 'active'
    })
    const saving = ref(false)
    const errorMessage = ref('')
    
    // فتح نافذة إضافة مستخدم جديد
    const openAddUserModal = () => {
      isEditing.value = false
      userForm.value = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'representative',
        phone: '',
        address: '',
        status: 'active'
      }
      errorMessage.value = ''
      showUserModal.value = true
    }
    
    // فتح نافذة تعديل مستخدم
    const editUser = (user) => {
      isEditing.value = true
      userForm.value = { ...user }
      errorMessage.value = ''
      showUserModal.value = true
    }
    
    // إغلاق نافذة المستخدم
    const closeUserModal = () => {
      showUserModal.value = false
    }
    
    // حفظ المستخدم
    const saveUser = async () => {
      try {
        saving.value = true
        errorMessage.value = ''
        
        if (isEditing.value) {
          // تحديث المستخدم
          const { error } = await authService.updateUser(userForm.value.id, {
            name: userForm.value.name,
            role: userForm.value.role,
            phone: userForm.value.phone,
            address: userForm.value.address,
            status: userForm.value.status
          })
          
          if (error) throw error
        } else {
          // إنشاء مستخدم جديد
          const { error } = await authService.createUser(
            userForm.value.email,
            userForm.value.password,
            {
              name: userForm.value.name,
              role: userForm.value.role,
              phone: userForm.value.phone,
              address: userForm.value.address,
              status: userForm.value.status
            }
          )
          
          if (error) throw error
        }
        
        // إعادة تحميل المستخدمين
        await fetchUsers()
        
        // إغلاق النافذة
        closeUserModal()
      } catch (error) {
        console.error('خطأ في حفظ المستخدم:', error)
        errorMessage.value = `خطأ في حفظ المستخدم: ${error.message}`
      } finally {
        saving.value = false
      }
    }
    
    // متغيرات نافذة تأكيد الحذف
    const showDeleteModal = ref(false)
    const userToDelete = ref(null)
    const deleting = ref(false)
    
    // التحقق من إمكانية حذف المستخدم
    const canDeleteUser = (user) => {
      // المدير العام لا يمكن حذفه
      if (user.role === 'admin') return false
      
      // مدير المبيعات لا يمكنه حذف مدير آخر
      if (user.role === 'sales_manager' && currentUser.value.role === 'sales_manager') return false
      
      return true
    }
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }
    
    // حذف المستخدم
    const deleteUser = async () => {
      if (!userToDelete.value) return
      
      try {
        deleting.value = true
        
        const { error } = await authService.deleteUser(userToDelete.value.id)
        
        if (error) throw error
        
        // إعادة تحميل المستخدمين
        await fetchUsers()
        
        // إغلاق النافذة
        closeDeleteModal()
      } catch (error) {
        console.error('خطأ في حذف المستخدم:', error)
        alert(`خطأ في حذف المستخدم: ${error.message}`)
      } finally {
        deleting.value = false
      }
    }
    
    // متغيرات نافذة إعادة تعيين كلمة المرور
    const showResetModal = ref(false)
    const userToReset = ref(null)
    const newPassword = ref('')
    const resetting = ref(false)
    const resetErrorMessage = ref('')
    
    // فتح نافذة إعادة تعيين كلمة المرور
    const resetPassword = (user) => {
      userToReset.value = user
      newPassword.value = ''
      resetErrorMessage.value = ''
      showResetModal.value = true
    }
    
    // إغلاق نافذة إعادة تعيين كلمة المرور
    const closeResetModal = () => {
      showResetModal.value = false
      userToReset.value = null
    }
    
    // إعادة تعيين كلمة المرور
    const submitResetPassword = async () => {
      if (!userToReset.value) return
      
      try {
        resetting.value = true
        resetErrorMessage.value = ''
        
        // إعادة تعيين كلمة المرور
        const { error } = await supabase.auth.admin.updateUserById(
          userToReset.value.id,
          { password: newPassword.value }
        )
        
        if (error) throw error
        
        // إغلاق النافذة
        closeResetModal()
        
        // إظهار رسالة نجاح
        alert('تم إعادة تعيين كلمة المرور بنجاح')
      } catch (error) {
        console.error('خطأ في إعادة تعيين كلمة المرور:', error)
        resetErrorMessage.value = `خطأ في إعادة تعيين كلمة المرور: ${error.message}`
      } finally {
        resetting.value = false
      }
    }
    
    // التحقق من إمكانية تغيير دور المستخدم
    const canChangeRole = (user) => {
      // المدير العام فقط يمكنه تعيين مدير عام آخر
      if (user.role === 'admin' && currentUser.value.role !== 'admin') return false
      
      // لا يمكن تغيير دور المستخدم الحالي
      if (user.id === currentUser.value.id) return false
      
      return true
    }
    
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      currentUser,
      user: currentUser,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      logout,
      loading,
      users,
      searchQuery,
      filteredUsers,
      getRoleName,
      getStatusName,
      getStatusClass,
      
      // إضافة/تعديل مستخدم
      showUserModal,
      isEditing,
      userForm,
      saving,
      errorMessage,
      openAddUserModal,
      editUser,
      closeUserModal,
      saveUser,
      canChangeRole,
      
      // حذف مستخدم
      showDeleteModal,
      userToDelete,
      deleting,
      canDeleteUser,
      confirmDeleteUser,
      closeDeleteModal,
      deleteUser,
      
      // إعادة تعيين كلمة المرور
      showResetModal,
      userToReset,
      newPassword,
      resetting,
      resetErrorMessage,
      resetPassword,
      closeResetModal,
      submitResetPassword
    }
  }
}
</script>
