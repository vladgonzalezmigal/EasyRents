'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Creates and returns a Supabase client for server-side operations
 * @returns A promise that resolves to a Supabase client
 */
export default async function getSupabaseClient() {
  const supabase = createClient()
  return supabase
}