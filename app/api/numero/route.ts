import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(req: Request) {
  const body = await req.json()
  const { numero, usuario, pago, vendio, marcado } = body
  if (!marcado) {
    const { error } = await supabase.from('numeros').delete().eq('numero', numero)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }
  const { data, error } = await supabase.from('numeros')
    .upsert({ numero, usuario, pago, vendio, marcado: true, updated_at: new Date().toISOString() })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
