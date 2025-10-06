import { createClient } from '@/app/utils/supabase/client';

// Get user
export const getUser = cache(async () => {
const supabase = createClient();
  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })
 
    const user = data[0]
 
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})

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
