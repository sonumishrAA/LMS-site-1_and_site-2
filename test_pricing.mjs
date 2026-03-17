import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), 'site-1/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const { data, error } = await supabase
    .from('pricing_config')
    .update({ duration_minutes: 10, amount: 1 })
    .eq('plan', '1m')
    .select()

  console.log('Update result:', data)
  console.log('Error:', error)
}
test()
