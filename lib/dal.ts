import { createClient } from '@/db/utils/client';

// Get user by email
export async function getUserByEmail(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw error;
  return data;
}

// Get current user (from auth session)
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get issue
// Get issues
