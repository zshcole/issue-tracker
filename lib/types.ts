// Supabase-friendly types for issues and users
// We avoid importing the Drizzle `Issue` type here so the types remain
// usable from both client and server code that talk to Supabase.

export type Status = 'backlog' | 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Issue {
  id: number
  title: string
  description?: string | null
  status: Status
  priority: Priority
  // store timestamps as ISO strings coming from Supabase
  createdAt: string
  updatedAt?: string | null
  // foreign key to users table (if present)
  userId?: string | null
}

export interface IssueWithUser extends Issue {
  user?: {
    id: string
    email: string
  } | null
}

export interface FormData {
    email: string;
    password: string;
}