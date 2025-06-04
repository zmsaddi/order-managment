import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  try {
    const { userId, disable } = req.body

    if (!userId || typeof disable !== 'boolean') {
      return res.status(400).json({ error: 'userId و disable مطلوبان' })
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      disabled: disable
    })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
