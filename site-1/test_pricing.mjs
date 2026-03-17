import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  // Use lowercase '1m' since that's what the UI probably should send but what is it sending?
  // Let's first read the actual rows.
  const { data: rows } = await supabase.from('pricing_config').select('*')
  console.log('Current rows:', rows)

  const { data, error } = await supabase
    .from('pricing_config')
    .update({ duration_minutes: 10, amount: 1 })
    .eq('plan', '1m')
    .select()

  console.log('\nUpdate 1m result:', data)
  console.log('Update 1m error:', error)
  
  const { data: d2, error: e2 } = await supabase
    .from('pricing_config')
    .update({ duration_minutes: 10, amount: 1 })
    .eq('plan', '1M')
    .select()

  console.log('\nUpdate 1M result:', d2)
  console.log('Update 1M error:', e2)
}
test()
