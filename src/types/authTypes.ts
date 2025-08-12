import { Session } from "@supabase/supabase-js";

export type SessionState = Session | null | 'loading';