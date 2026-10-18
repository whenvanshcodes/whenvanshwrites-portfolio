import { getSupabaseAdmin } from '../lib/supabase/admin';
import * as schema from './schema';

export function getDb() {
  return getSupabaseAdmin();
}

export { schema };
