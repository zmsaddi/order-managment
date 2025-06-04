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
