import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  published_at: string
  created_at: string
  updated_at: string
  categories: string[]
  tags: string[]
  reading_time: string
}

export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Page = {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  updated_at: string
}
