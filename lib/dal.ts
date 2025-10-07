import { createClient } from '@/app/utils/supabase/client';

// Get user
export async function getUser(id: number) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Failed to fetch user with id ${id}:`, error.message || error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching user with id ${id}:`, error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) {
      console.error(`Failed to fetch user with email ${email}:`, error.message || error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching user with email ${email}:`, error);
    return null;
  }
}

// Get current user (from auth session)
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get user issue
export async function getIssue(id: number) {
  const supabase = createClient()
  const { data, error } = await supabase
  .from('issues')
  .select('*, user(*)') // fetch issue and related user
  .eq('id', id)
  .single();

  if (error) {
    console.error(`Error fetching issue ${id}`, error)
    throw new Error('Failed to fetch issue')
  }
  return data;
}

// Get issues
export async function getIssues() {
  const supabase = createClient()
  const {data, error } = await supabase
  .from('issues')
  .select('*')
  .order('createdAt', { ascending: false });

  if (error) {
    console.error(`Error fetching issues`, error)
    throw new Error('Failed to fetch issues')
  }
  return data;
}
