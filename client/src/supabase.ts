// This file is deprecated and replaced with client/src/lib/api.ts
// Keeping it temporarily to avoid breaking imports during migration
console.warn('supabase.ts is deprecated. Use apiClient from lib/api.ts instead');

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.reject(new Error('Use apiClient.login instead')),
    signUp: () => Promise.reject(new Error('Use apiClient.signup instead')),
    signOut: () => Promise.reject(new Error('Use apiClient.logout instead')),
    resetPasswordForEmail: () => Promise.reject(new Error('Use apiClient.resetPassword instead')),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.reject(new Error('Use apiClient methods instead')) }) }),
    insert: () => Promise.reject(new Error('Use apiClient methods instead')),
    update: () => ({ eq: () => Promise.reject(new Error('Use apiClient methods instead')) }),
  }),
}; 